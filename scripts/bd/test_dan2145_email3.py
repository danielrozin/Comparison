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
import io
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


def check_unknown_flag_aborts(m):
    """A typo'd FLAG must not be able to masquerade as a completed send.

    `--sned` contains no "--send", so it used to fall through to the preflight branch,
    print "=== PREFLIGHT PASS ===" and exit 0 — the same output and the same exit code
    as a clean dry run, from an invocation that intended to send and sent nothing. This
    is the more dangerous twin of the unknown --drop above: Email-3 is the final touch,
    so a green run that mailed nobody is never revisited.
    """
    import subprocess

    env = dict(os.environ, RESEND_API_KEY="dummy-not-a-real-key",
               RESEND_FROM_EMAIL=m.LOCKED_FROM, RESEND_REPLY_TO=m.LOCKED_REPLY_TO)

    for typo in ("--sned", "--send-all", "-send"):
        r = subprocess.run([sys.executable, SCRIPT, typo],
                           capture_output=True, text=True, env=env, timeout=60)
        assert r.returncode == 6, f"{typo} did not abort (exit {r.returncode})"
        assert "unrecognised flag" in r.stdout, f"abort reason not surfaced:\n{r.stdout}"
        assert "PREFLIGHT PASS" not in r.stdout, f"{typo} still printed a reassuring pass"
        assert "SENDING" not in r.stdout, f"{typo} reached the send stage"

    # The bare dry run is the invocation we re-run every heartbeat — it must keep its
    # exit 0, or the guard has traded one false signal for another.
    r2 = subprocess.run([sys.executable, SCRIPT], capture_output=True, text=True,
                        env=env, timeout=120)
    assert r2.returncode == 0, f"bare preflight wrongly aborted:\n{r2.stdout}"
    assert "PREFLIGHT PASS" in r2.stdout, f"bare preflight lost its pass line:\n{r2.stdout}"

    # ...and so must the EXPLICIT form. The whitelist originally omitted --preflight, so
    # the one command we tell the fire-time operator to run first (line 5 of the script,
    # the routine body, and the script's own URL-abort board comment all hand it out)
    # aborted with "unrecognised flag". Checking only the bare form missed that entirely:
    # the two invocations mean the same thing to a reader and different things to argv.
    r3 = subprocess.run([sys.executable, SCRIPT, "--preflight"], capture_output=True,
                        text=True, env=env, timeout=120)
    assert r3.returncode == 0, f"--preflight wrongly aborted:\n{r3.stdout}"
    assert "PREFLIGHT PASS" in r3.stdout, f"--preflight lost its pass line:\n{r3.stdout}"
    assert "unrecognised flag" not in r3.stdout, "--preflight rejected by the whitelist"

    # Every invocation this repo documents must be accepted. If someone adds a flag to the
    # docstring without whitelisting it, that is the same defect again under a new name.
    with open(SCRIPT) as fh:
        docstring_flags = set(re.findall(r"dan2145-email3\.py ((?:--[a-z-]+))", fh.read()))
    known = set(re.search(r"KNOWN_FLAGS = \{([^}]*)\}",
                          open(SCRIPT).read()).group(1).replace('"', "").split(", "))
    undocumented = docstring_flags - known
    assert not undocumented, f"documented but not whitelisted: {sorted(undocumented)}"

    print("PASS — typo'd flags abort (exit 6) without printing a pass line; "
          "bare AND --preflight forms still exit 0; every documented flag is whitelisted.")


def check_lbs_unblock_guards(m):
    """unblock_lbs must issue NO write unless the send landed AND the msg-ids posted.

    Both guards protect a live agent from being dispatched on a false premise: LBS
    verifying links for a pitch nobody received, or starting a task whose own stated
    precondition (the DAN-2145 msg-id table) is still missing from the board.
    """
    os.environ.setdefault("PAPERCLIP_API_URL", "https://example.invalid")
    os.environ.setdefault("PAPERCLIP_API_KEY", "test-key")
    calls = []

    class Resp:
        def __init__(self, payload):
            self._p, self.status = payload, 200

        def read(self):
            return json.dumps(self._p).encode()

        def __enter__(self):
            return self

        def __exit__(self, *a):
            return False

    real = m.urllib.request.urlopen

    def fake(req, timeout=None):
        calls.append(req.get_method())
        return Resp({"status": "todo"})

    m.urllib.request.urlopen = fake
    try:
        assert m.unblock_lbs(delivered=False, msgids_logged=True) is False, \
            "unblocked LBS with zero successful sends"
        assert not calls, f"issued a write despite no delivery: {calls}"

        assert m.unblock_lbs(delivered=True, msgids_logged=False) is False, \
            "unblocked LBS before the msg-id table landed"
        assert not calls, f"issued a write before msg-ids were logged: {calls}"

        assert m.unblock_lbs(delivered=True, msgids_logged=True) is True, \
            "did not unblock LBS on the happy path"
        assert calls == ["PATCH", "GET"], \
            f"expected PATCH then an independent GET read-back, got {calls}"
    finally:
        m.urllib.request.urlopen = real

    # A PATCH the API silently drops must never report success.
    calls.clear()

    def fake_dropped(req, timeout=None):
        calls.append(req.get_method())
        return Resp({"status": "blocked"})

    m.urllib.request.urlopen = fake_dropped
    try:
        assert m.unblock_lbs(delivered=True, msgids_logged=True) is False, \
            "reported success while the issue still reads blocked"
    finally:
        m.urllib.request.urlopen = real

    print("PASS — unblock_lbs writes only after a real send AND a landed msg-id table, "
          "and trusts the read-back over the PATCH echo.")


def check_archive_reporting(m):
    """The archive now runs LAST, after the msg-id comment, so that comment can no longer
    state the outcome — it says "pending" and promises a follow-up. Three renderings have
    to stay distinct, or a run that never archived reads as one that did.

    This is the limb that matters most if it rots: a routine reported as archived but
    still armed re-sends Email-3 to all three editors on 2027-07-21, unattended.
    """
    real = m.urllib.request.urlopen
    os.environ.setdefault("PAPERCLIP_API_URL", "http://test.invalid")
    os.environ.setdefault("PAPERCLIP_API_KEY", "test-key")
    bodies = []

    class Resp:
        def __enter__(s):
            return io.BytesIO(b"{}")

        def __exit__(s, *a):
            return False

    def capture(req, timeout=None):
        bodies.append(json.loads(req.data.decode())["body"])
        return Resp()

    m.urllib.request.urlopen = capture
    try:
        rows = [{"to": "kob.monney@trustedreviews.com", "id": "m1", "url": "u"}]
        rendered = {}
        for state in (True, False, None):
            bodies.clear()
            m.log_msgids(rows, "reply status VERIFIED", state,
                         only=[("DAN-2145", "test-id")])
            rendered[state] = [l for l in bodies[0].split("\n") if "Firing routine" in l][0]

        assert "**archived**" in rendered[True], rendered[True]
        assert "STILL ARMED" in rendered[False], rendered[False]
        # The pending line must NOT claim either outcome, and must tell a reader what to
        # do when the follow-up comment is missing — that is its whole job.
        assert "STILL ARMED" not in rendered[None] and "**archived**" not in rendered[None], \
            f"pending line claims a settled outcome: {rendered[None]}"
        assert "assume it did not run" in rendered[None], rendered[None]
        assert len(set(rendered.values())) == 3, "archive states render identically"

        # The follow-up itself must distinguish success from failure loudly.
        bodies.clear()
        m.log_archive_result(True)
        assert bodies and "**archived**" in bodies[0], "archive success not reported"
        bodies.clear()
        m.log_archive_result(False)
        assert bodies and "STILL ARMED" in bodies[0], "archive failure not reported loudly"
    finally:
        m.urllib.request.urlopen = real

    print("PASS — archive outcome is reported in a follow-up; pending/archived/still-armed "
          "render distinctly and pending never claims a settled outcome.")


def check_preview_cleans_up(m):
    """--preview-log must never leave a msg-id table on the thread.

    The guardrail on DAN-2145 says whoever fires STOPS if Email-3 msg-ids are already
    logged. A preview renders that same table, so a leftover rehearsal comment is a trap
    that aborts the real send. Two things are asserted: the preview posts only to
    DAN-2145 (never the shared wave issue DAN-1737), and removal is confirmed by the
    banner being gone from the thread — NOT by the row disappearing, because DELETE
    tombstones the row and returns 200 regardless.
    """
    os.environ.setdefault("PAPERCLIP_API_URL", "http://test.invalid")
    os.environ.setdefault("PAPERCLIP_API_KEY", "test-key")
    real = m.urllib.request.urlopen
    thread = []          # server-side comment list
    deleted = set()

    class Resp(io.BytesIO):
        def __enter__(s):
            return s

        def __exit__(s, *a):
            return False

    def fake(req, timeout=None):
        method, url = req.get_method(), req.full_url
        if method == "POST":
            cid = f"c{len(thread)}"
            thread.append({"id": cid, "body": json.loads(req.data.decode())["body"]})
            return Resp(json.dumps({"id": cid}).encode())
        if method == "DELETE":
            cid = url.rstrip("/").rsplit("/", 1)[-1]
            deleted.add(cid)
            # Tombstone, exactly like the real API: row stays, body is cleared.
            for c in thread:
                if c["id"] == cid:
                    c["body"] = ""
            return Resp(b"{}")
        return Resp(json.dumps(thread).encode())

    m.urllib.request.urlopen = fake
    try:
        created = []
        m.log_msgids([{"to": "kob.monney@trustedreviews.com", "id": "PLACEHOLDER-1",
                       "url": "u"}], "reply status UNVERIFIED (dry run)", None,
                     preview=True, only=m.LOG_ISSUES[:1], created=created)
        assert len(created) == 1, f"preview did not record its comment id: {created}"
        assert created[0][0] == m.LOG_ISSUES[0][1], "preview posted to the wrong issue"
        assert m.PREVIEW_MARKER in thread[0]["body"], "preview comment lacks the banner"

        leftover = m.cleanup_preview(created)
        assert deleted, "cleanup issued no DELETE"
        assert not leftover, f"cleanup reported leftovers after a real delete: {leftover}"
        assert not any(m.PREVIEW_MARKER in c["body"] for c in thread), "banner survived"
        # The tombstoned row is still in the thread — a row-id check would have called
        # this a failure. Confirm the marker-based check tolerates it.
        assert any(c["id"] in deleted for c in thread), \
            "test bug: tombstone not simulated, so row-vs-banner is not exercised"

        # And the inverse: a delete that silently does nothing must be caught.
        thread.clear()
        deleted.clear()
        created2 = []
        m.log_msgids([{"to": "x@y.com", "id": "PLACEHOLDER-1", "url": "u"}],
                     "dry run", None, preview=True, only=m.LOG_ISSUES[:1],
                     created=created2)

        def fake_no_delete(req, timeout=None):
            if req.get_method() == "DELETE":
                return Resp(b"{}")      # 200, but does not apply
            return fake(req, timeout)

        m.urllib.request.urlopen = fake_no_delete
        assert m.cleanup_preview(created2), \
            "a DELETE that returned 200 without applying was reported as clean"
    finally:
        m.urllib.request.urlopen = real
    print("PASS — --preview-log posts only to DAN-2145 and its comment is removed, "
          "verified by banner absence (tombstone-safe); a no-op DELETE is caught.")


# Every suite this harness is expected to run. The count is asserted below so that a
# suite which silently stops running (early return, lost call, renamed function) fails
# loudly instead of shrinking the PASS list by one line that nobody counts. The fire-time
# routine tells the operator to match the printed tally against this number.
EXPECTED_SUITES = 7


def main():
    m = load()
    ran = 0
    for suite in (check_reply_fail_open, check_unknown_drop_aborts,
                  check_unknown_flag_aborts, check_lbs_unblock_guards,
                  check_archive_reporting, check_preview_cleans_up):
        suite(m)
        ran += 1
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
    ran += 1

    if ran != EXPECTED_SUITES:
        print(f"FAIL — {ran}/{EXPECTED_SUITES} suites ran. A suite silently stopped "
              f"running; the PASS lines above do NOT cover the whole send path.")
        return 1
    print(f"{ran}/{EXPECTED_SUITES} suites PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
