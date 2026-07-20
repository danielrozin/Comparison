#!/usr/bin/env python3
"""Offline rehearsal of dan2145-email3.py's send() loop. Sends NOTHING.

Why this exists: every other gate on DAN-2145 (URL preflight, identity lock, the
step-4 msg-id POST, the archive PATCH) was exercised against a live endpoint before
the fire. send() itself never was — the only live proof was a single one-recipient
identity probe. This harness mocks the transport so the real 3-recipient loop can be
run end to end, which is what catches an unrendered placeholder, a dropped reply_to,
a missing browser UA, or a guard file that is only written after the whole loop.

Run:  python3 test_dan2145_email3.py     (exit 0 = pass)

It monkeypatches urlopen + time.sleep and writes its guard file to a temp path, so it
is safe to run at any time, including minutes before the real fire. It deliberately
does NOT touch the canonical results file — running this never arms the idempotency
guard and never suppresses the real send.
"""
import importlib.util
import json
import os
import re
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
SCRIPT = os.path.join(HERE, "dan2145-email3.py")

# Copy claims that must never appear: DAN-1614 put the pages outside the top 100, and
# the catalog total is unreconciled between the live study page and our circulated figure.
FORBIDDEN = ["rank", "#1", "top 100", "catalog", "traffic", "comparisons live"]


def load():
    spec = importlib.util.spec_from_file_location("e3", SCRIPT)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def main():
    m = load()
    captured = []

    class FakeResp:
        def __init__(self, mid):
            self._mid, self.status = mid, 200

        def read(self):
            return json.dumps({"id": self._mid}).encode()

        def __enter__(self):
            return self

        def __exit__(self, *a):
            return False

    def fake_urlopen(req, timeout=None):
        captured.append({"url": req.full_url, "hdrs": dict(req.headers),
                         "body": json.loads(req.data.decode())})
        return FakeResp("rehearsal-%d" % len(captured))

    m.urllib.request.urlopen = fake_urlopen
    slept = []
    m.time.sleep = slept.append

    tmp = tempfile.mktemp(suffix=".json")
    persists = []

    def persist(rows):
        persists.append(len(rows))
        json.dump(rows, open(tmp, "w"), indent=2)

    m.send(m.TARGETS, persist)
    sends = [c for c in captured if "body" in c]

    assert len(sends) == 3, f"expected 3 sends, got {len(sends)}"
    # Guard must be written after EVERY recipient, not once at the end — a kill during
    # the 45s spacing must never leave a sent recipient with no guard on disk.
    assert persists == [1, 2, 3], f"guard not persisted per-recipient: {persists}"
    assert slept == [45, 45], f"expected 45s spacing between sends, got {slept}"

    seen = set()
    for c in sends:
        b, txt = c["body"], c["body"]["text"]
        assert b["from"] == m.LOCKED_FROM, f"identity drift: {b['from']}"
        assert b["reply_to"] == m.LOCKED_REPLY_TO, f"reply_to drift: {b['reply_to']}"
        assert "aversusb.net" not in b["from"], "banned sending domain in from"
        ua = c["hdrs"].get("User-agent", "")
        assert "Mozilla" in ua, f"non-browser UA would hit Cloudflare 403 1010: {ua!r}"
        assert b["subject"].startswith("Re: "), "lost the Re: thread prefix"
        assert "{" not in txt and "}" not in txt, "unrendered placeholder in body"
        for bad in FORBIDDEN:
            assert bad not in txt.lower(), f"forbidden claim in copy: {bad}"
        urls = re.findall(r"https?://\S+", txt)
        assert len(urls) == 1, f"expected exactly 1 URL in body, got {urls}"
        seen.add(b["to"][0])

    assert seen == {t["to"] for t in m.TARGETS}, "recipient set drifted"

    rows = json.load(open(tmp))
    assert all(r.get("id") for r in rows), "msg-id missing from persisted results"
    os.unlink(tmp)

    print(f"PASS — 3 sends rehearsed, identity {m.LOCKED_FROM}, "
          f"per-recipient guard, 45s spacing, copy clean. Nothing was sent.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
