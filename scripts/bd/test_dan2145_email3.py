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


class FakeIMAP:
    """Stands in for imaplib.IMAP4_SSL. `script` maps a search term to a hit count;
    the SINCE-only control query is keyed under "__control__"."""

    def __init__(self, script, fail_on_login=False):
        self.script, self.fail_on_login = script, fail_on_login
        self.logged_out = False

    def login(self, user, pw):
        if self.fail_on_login:
            raise OSError("[AUTHENTICATIONFAILED] Invalid credentials (Failure)")

    def select(self, box, readonly=False):
        pass

    def search(self, charset, *criteria):
        key = "__control__" if criteria[0] == "SINCE" else criteria[1]
        n = self.script.get(key, 0)
        return "OK", [b" ".join(b"%d" % i for i in range(1, n + 1))]

    def logout(self):
        self.logged_out = True


def check_reply_fail_open(m):
    """reply_check() auto-selects at fire time the moment GMAIL_APP_PASSWORD lands
    (DAN-2513). It must FAIL OPEN on every error: a broken reply check means send
    reply-blind and log it, never block and never crash the run.

    The control-query branch is the one that cannot be exercised against a live inbox
    (it needs a reachable-but-empty mailbox), and it is the most dangerous to get wrong:
    a dead connection and a genuinely empty inbox both return zero, so a zero control
    must degrade to UNVERIFIED rather than being reported as "0 responders".
    """
    import types

    def run(script=None, fail_on_login=False, pw="app-password"):
        box = {}
        fake = types.ModuleType("imaplib")
        fake.IMAP4_SSL = lambda host, timeout=None: box.setdefault(
            "c", FakeIMAP(script or {}, fail_on_login))
        sys.modules["imaplib"] = fake
        prev = os.environ.get("GMAIL_APP_PASSWORD")
        if pw is None:
            os.environ.pop("GMAIL_APP_PASSWORD", None)
        else:
            os.environ["GMAIL_APP_PASSWORD"] = pw
        try:
            return m.reply_check(m.TARGETS), box.get("c")
        finally:
            sys.modules.pop("imaplib", None)
            if prev is None:
                os.environ.pop("GMAIL_APP_PASSWORD", None)
            else:
                os.environ["GMAIL_APP_PASSWORD"] = prev

    a, b, c = m.TARGETS[0]["to"], m.TARGETS[1]["to"], m.TARGETS[2]["to"]

    # 1. Var unset -> ladder path 3, no connection attempted.
    (resp, ver), conn = run(pw=None)
    assert (resp, ver) == (set(), False), f"unset must be blind, got {resp} {ver}"
    assert conn is None, "must not dial IMAP without a password"

    # 2. Bad/expired app password -> fail open, not an exception. Verified live against
    #    imap.gmail.com on 2026-07-20: real AUTHENTICATIONFAILED lands here.
    (resp, ver), _ = run(fail_on_login=True)
    assert (resp, ver) == (set(), False), f"auth failure must be blind, got {resp} {ver}"

    # 3. Connected but control query is ZERO -> indistinguishable from a dead pipe.
    #    Must be UNVERIFIED even though the per-recipient searches also returned clean.
    (resp, ver), _ = run({"__control__": 0})
    assert (resp, ver) == (set(), False), f"zero control must be blind, got {resp} {ver}"

    # 4. Live inbox, nobody replied -> VERIFIED, full recipient list retained.
    (resp, ver), conn = run({"__control__": 201})
    assert (resp, ver) == (set(), True), f"clean live sweep must verify, got {resp} {ver}"
    assert conn.logged_out, "IMAP connection leaked on the success path"

    # 5. Live inbox with a responder -> that address drops, and ONLY that one.
    (resp, ver), _ = run({"__control__": 201, b: 2})
    assert ver is True and resp == {b.lower()}, f"responder not isolated: {resp} {ver}"
    assert a.lower() not in resp and c.lower() not in resp, "dropped a non-responder"

    print("PASS — reply_check fails open on unset/auth-failure/zero-control, "
          "verifies only against a non-zero control, drops only real responders.")


def check_unknown_drop_aborts(m):
    """A hand-typed --drop is the last thing protecting a responder from an email we
    promised not to send. An address matching no recipient must ABORT, not be accepted
    in silence — the old code printed "DROPPED (responder): <typo>" and then emailed
    that very person, which is worse than no drop at all because it reads as success.

    Runs the real script in a subprocess (the parsing lives in __main__). Creds are set
    to the locked identity with a dummy key so we reach the drop check rather than
    exiting 3 first; the abort happens before reply_check/preflight/send, so no network
    call and no email are possible on either path below.
    """
    import subprocess

    env = dict(os.environ, RESEND_API_KEY="dummy-not-a-real-key",
               RESEND_FROM_EMAIL=m.LOCKED_FROM, RESEND_REPLY_TO=m.LOCKED_REPLY_TO)
    real = m.TARGETS[0]["to"]
    typo = real.split(".", 1)[1] if "." in real.split("@")[0] else "nobody@example.com"

    r = subprocess.run([sys.executable, SCRIPT, "--send", "--drop", typo],
                       capture_output=True, text=True, env=env, timeout=60)
    assert r.returncode == 5, f"typo'd --drop {typo} did not abort (exit {r.returncode})"
    assert "match no recipient" in r.stdout, f"abort reason not surfaced:\n{r.stdout}"
    assert "DROPPED (responder)" not in r.stdout, "still printed a reassuring drop line"
    assert "SENDING" not in r.stdout, "reached the send stage after a bad --drop"

    # The reversed flag order the runbook does not document must still parse, not be
    # mistaken for an address: --send is a flag, and flagging it as "unknown recipient"
    # would abort a legitimate invocation. Dropping ALL THREE recipients is what keeps
    # this case honest — it exits at "nothing to send" before preflight and before the
    # send loop, so a live email is not reachable from this test even though it carries
    # a --send flag and a real recipient list.
    r2 = subprocess.run([sys.executable, SCRIPT, "--drop", *[t["to"] for t in m.TARGETS],
                         "--send"], capture_output=True, text=True, env=env, timeout=60)
    assert r2.returncode == 0, f"valid --drop before --send wrongly aborted:\n{r2.stdout}"
    assert "Nothing to send" in r2.stdout, f"did not reach the all-dropped exit:\n{r2.stdout}"
    assert "SENDING" not in r2.stdout, "reached the send stage with every recipient dropped"

    print(f"PASS — unknown --drop aborts (exit 5) before any send; "
          f"flag order --drop/--send still parses.")


def main():
    m = load()
    check_reply_fail_open(m)
    check_unknown_drop_aborts(m)
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
