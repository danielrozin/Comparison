#!/usr/bin/env python3
"""DAN-2145 — Wave-1 Email-3 (FINAL touch), non-responders only.

Usage:
    python3 dan2145-email3.py --preflight      # read-only: URL re-curl + control tests, no sends
    python3 dan2145-email3.py --send           # preflight, then send (aborts if preflight fails)
    python3 dan2145-email3.py --send --drop kob.monney@trustedreviews.com   # drop a responder

Fire window: Tue 2026-07-21 09:00 UTC. Email-3 is FINAL — do NOT arm an Email-4.
After sending: log msg-ids on DAN-2145 + DAN-1737, ARCHIVE routine 2caeede7 (its cron
`0 9 21 7 *` is a YEARLY pattern and silently re-arms for 2027 if left active), mark
DAN-2145 done, hand 7-14d live-link verification to LBS.
"""
import os, sys, json, time, urllib.request, urllib.error

# Repo .env.local, as a FALLBACK for vars the ambient environment does not supply.
# This is not belt-and-braces. Of the three send vars, only RESEND_API_KEY and
# RESEND_FROM_EMAIL are persisted anywhere; RESEND_REPLY_TO exists solely because the
# harness injects it at runtime. It is in no shell profile and no dotenv file, so a
# fire-time run under any launcher that does not inject it hits the step-3 abort
# ("ABORT: unset env var(s): RESEND_REPLY_TO") and the send never happens — on a
# one-shot routine, with nobody watching. Sourcing the file removes the dependency on
# who spawns us. Existing env always wins, so this can never override a live value.
# Anchored absolutely, not relative to __file__: this script exists as TWO copies (the
# repo backup at scripts/bd/ and the BD-workspace copy that actually fires), and only
# the repo copy sits two levels under .env.local. A __file__-relative path would
# silently resolve to nothing for the copy that matters.
ENV_FILE_CANDIDATES = (
    os.path.expanduser(
        "~/.paperclip/instances/default/projects/"
        "3bac00ef-9dd8-442f-8e07-9176d1e1c247/"
        "8af50701-a454-4b0c-98ee-b2bb66b2dfa2/Comparison/.env.local"),
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".env.local"),
)


# STRICT ALLOWLIST — do not widen. .env.local is the *web app's* config, not BD's.
# Its RESEND_FROM_EMAIL is `A Versus B <noreply@aversusb.net>` (plus a literal \n),
# which is plausibly right for the app's transactional mail and catastrophic for
# outreach: aversusb.net is a domain the DAN-1991 identity lock explicitly refuses,
# and a stale FROM still returns HTTP 200 and delivers, so the failure is silent. That
# exact mistake already sent prospect mail from a retired address once. Falling back
# for FROM or the API key would trade a loud abort for a silent identity break, so
# only REPLY_TO — the one var no file or profile persists — is sourced here.
ENV_FALLBACK_ALLOWLIST = ("RESEND_REPLY_TO",)


def _load_env_fallback(paths=ENV_FILE_CANDIDATES,
                       allow=ENV_FALLBACK_ALLOWLIST):
    for path in paths:
        try:
            with open(path) as fh:
                for line in fh:
                    line = line.strip()
                    if not line or line.startswith("#") or "=" not in line:
                        continue
                    k, _, v = line.partition("=")
                    k, v = k.strip(), v.strip().strip('"').strip("'")
                    if k in allow and v:
                        os.environ.setdefault(k, v)
            return path
        except FileNotFoundError:
            continue
        except Exception as e:
            print(f"WARN: could not read {path} ({type(e).__name__}: {e})")
    return None


_ENV_SRC = _load_env_fallback()

# Read lazily, not at import — --preflight must work with no credentials in the env.
KEY = os.environ.get("RESEND_API_KEY")
FROM = os.environ.get("RESEND_FROM_EMAIL")
REPLY = os.environ.get("RESEND_REPLY_TO")
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")

# Anchored to ONE canonical absolute path, not the CWD and not the script dir.
# The idempotency guard is the only thing preventing a double-send. A CWD-relative
# path disarms it when the fire-time agent runs from anywhere else; a script-dir
# path disarms it across the two copies of this file (BD workspace + the repo
# backup at scripts/bd/), because each copy would consult its own guard and neither
# would see the other's send. Both copies must resolve to the same file.
CANONICAL_DIR = os.path.expanduser(
    "~/.paperclip/instances/default/workspaces/a092227f-f61f-41e5-857b-5fb73b821aa0")
RESULTS_FILE = os.path.join(
    CANONICAL_DIR if os.path.isdir(CANONICAL_DIR)
    else os.path.dirname(os.path.abspath(__file__)),
    "dan2145-email3-results.json")

# Final-touch copy. Rank-independent (DAN-1614: not-in-top-100). NEVER add a rank,
# traffic, or catalog-total claim — the catalog figure is unreconciled.
BODY = """Hi {first},

Last note from me on this — I'll leave you be after this one.

If a free, maintained {topic} comparison is ever useful for your readers, the page is here (specs, pricing, sourced verdict, no affiliate filler):

{url}

Either way, thanks for the work you put out.

— Dani, aversusb.net"""

TARGETS = [
    dict(to="kob.monney@trustedreviews.com", first="Kob", topic="JBL vs Bose",
         subject="Re: JBL vs Bose — 260 monthly searches, free data-backed comparison",
         url="https://www.aversusb.net/compare/bose-vs-jbl",
         h1_must_contain="JBL vs Bose"),
    dict(to="aki@yankodesign.com", first="Aki", topic="PS5 Pro vs Xbox Series X",
         subject="Re: PS5 Pro vs Xbox Series X — 110 monthly searches, free data-backed comparison",
         url="https://www.aversusb.net/compare/ps5-pro-vs-xbox-series-x",
         h1_must_contain="PS5 Pro vs Xbox Series X"),
    dict(to="jess@cordcuttersnews.com", first="Jess", topic="Peacock vs Paramount+",
         subject="Re: Peacock vs Paramount+ — 260 monthly searches, free data-backed comparison",
         url="https://www.aversusb.net/compare/paramount-vs-peacock",
         h1_must_contain="Paramount+ vs Peacock"),
]

CONTROL_404_URL = "https://www.aversusb.net/compare/banana-vs-stapler"

# Email-2 went out 2026-07-14; only that window is unobserved.
SINCE_IMAP = "14-Jul-2026"


def reply_check(targets):
    """Step 1, decision-ladder path 2: IMAP reply sweep, used only if GMAIL_APP_PASSWORD
    is set (DAN-2513). Returns (responders, verified).

    FAILS OPEN BY DESIGN. Per the DAN-2145 amendment, an unavailable or broken reply
    check means send reply-blind and log it — it must never block the send or crash the
    run. Every failure path returns (empty set, verified=False).

    The control query is not optional: an inbox with zero replies and a dead connection
    both return zero hits. Without a non-zero control, a "0 responders" result is
    meaningless and we must report the send as reply-blind.
    """
    pw = os.environ.get("GMAIL_APP_PASSWORD")
    if not pw:
        print("REPLY CHECK: GMAIL_APP_PASSWORD unset (DAN-2513 not landed) — ladder path 3.")
        return set(), False

    user = os.environ.get("GMAIL_ADDR") or REPLY
    try:
        import imaplib
        M = imaplib.IMAP4_SSL("imap.gmail.com", timeout=30)
        try:
            M.login(user, pw)
            M.select("INBOX", readonly=True)

            typ, data = M.search(None, "SINCE", SINCE_IMAP)
            control = len(data[0].split()) if typ == "OK" and data and data[0] else 0
            print(f"REPLY CHECK: control query (all mail SINCE {SINCE_IMAP}) = {control} msg(s)")
            if control == 0:
                print("REPLY CHECK: control is ZERO — indistinguishable from a dead "
                      "connection. Treating as UNVERIFIED (ladder path 3).")
                return set(), False

            responders = set()
            for t in targets:
                typ, data = M.search(None, "FROM", t["to"], "SINCE", SINCE_IMAP)
                hits = len(data[0].split()) if typ == "OK" and data and data[0] else 0
                print(f"REPLY CHECK: {t['to']} — {hits} reply(ies)")
                if hits:
                    responders.add(t["to"].lower())
            print(f"REPLY CHECK: VERIFIED against a live inbox. "
                  f"{len(responders)} responder(s) to drop.")
            return responders, True
        finally:
            try:
                M.logout()
            except Exception:
                pass
    except Exception as e:
        print(f"REPLY CHECK: failed ({type(e).__name__}: {e}) — ladder path 3, send blind.")
        return set(), False


ROUTINE_ID = "2caeede7-c403-416a-961c-2295c4653f76"
TRIGGER_ID = "b4d6bbec-f0ba-436f-b1c4-b0a4e7d594bc"  # the `0 9 21 7 *` schedule trigger

# Runbook step 4 targets. Resolved by UUID, not by DAN-identifier: the issue list route
# caps at 1000 items and DAN-2145 already falls off the end of it, so an identifier
# lookup at fire time would silently find nothing.
LOG_ISSUES = [("DAN-2145", "ea3872fb-0f64-438e-a23d-7f82889a4add"),
              ("DAN-1737", "4e85951b-769b-4c63-bd12-b334b10610ef")]


def log_msgids(results, reply_note, archived, preview=False, only=None):
    """Runbook step 4, automated: post the returned msg-ids to DAN-2145 + DAN-1737.

    This was the last step still depending on a human/agent being alive after the send.
    The routine fires headless at 09:00Z with nobody watching; if that run died between
    step 3 and step 4 the msg-ids survived only in a local JSON file that nothing else
    reads, and the sequence would look unsent from the board.

    Best-effort by design — a failure here must never look like a failed send, so it
    only warns and the results file remains the source of truth.
    """
    api, key = os.environ.get("PAPERCLIP_API_URL"), os.environ.get("PAPERCLIP_API_KEY")
    if not (api and key):
        print("WARN: PAPERCLIP_API_URL/KEY unset — msg-ids NOT auto-logged. "
              f"Post them from {RESULTS_FILE} by hand.")
        return False

    sent = [r for r in results if r.get("id")]
    failed = [r for r in results if not r.get("id")]
    lines = [f"## DAN-2145 Email-3 SENT — {len(sent)}/{len(results)} delivered to Resend",
             "", f"**Reply status: {reply_note}**", ""]
    if not results or not sent:
        lines[0] = "## DAN-2145 Email-3 — NO SENDS SUCCEEDED"
    lines += ["| Recipient | Page | Resend msg-id |", "|---|---|---|"]
    for r in results:
        lines.append(f"| {r.get('to')} | {r.get('url', '—')} | "
                     f"`{r.get('id') or 'FAILED: ' + str(r.get('error'))}` |")
    lines += ["", f"Firing routine `{ROUTINE_ID}`: "
              + ("**archived** — cannot re-fire 2027-07-21."
                 if archived is True else
                 "⚠️ **STILL ARMED** — archive by hand or it re-sends 2027-07-21."
                 if archived is False else
                 "archive runs immediately after this comment. **If no ARCHIVED/STILL-ARMED "
                 "follow-up comment appears below, assume it did not run** — check the routine "
                 "and archive it by hand, or it re-sends to all three editors 2027-07-21."),
              "", "Email-3 is the FINAL touch. No Email-4. Remaining work: 7–14d live-link "
              "verification (LBS)."]
    if failed:
        # The routine fires headless with nobody watching stdout, so the "do not close
        # this out" instruction has to live in the comment or it reaches no one. Without
        # it the board sees an archived routine and a msg-id table and reads the
        # sequence as finished, while a real recipient never got Email-3.
        lines += ["", f"### ⚠️ {len(failed)} send(s) FAILED — not delivered",
                  "", "**Do NOT mark DAN-2145 done and do NOT report Email-3 as fully "
                  "sent.** These addresses received nothing: "
                  + ", ".join(f"`{r.get('to')}`" for r in failed) + ".",
                  "", "The routine is being archived (correct — it must never re-fire "
                  "wholesale), so the only path for these is a deliberate manual re-run: "
                  "move the results file aside and re-run with `--send --drop` listing "
                  "every address that already received it *and* every responder."]
    if "UNVERIFIED" in reply_note:
        lines += ["", "⚠️ Gmail was dark at send time (ladder path 3). These sends must "
                  "NEVER be counted toward a \"0 replies\" claim — 0 replies is a floor, "
                  "not a measurement. Report raw counts, never rates."]
    body = "\n".join(lines)
    if preview:
        # --preview-log: exercise the step-4 POST ahead of the fire with an unmistakably
        # non-real body, so a broken endpoint/auth/markdown round-trip surfaces now rather
        # than after three irreversible sends. Never let this be mistaken for a send log.
        body = ("> 🧪 **DRY RUN — NOTHING WAS SENT.** Step-4 logging-path rehearsal only. "
                "The msg-ids below are placeholders.\n\n" + body)

    hdrs = {"Authorization": f"Bearer {key}", "Content-Type": "application/json",
            "User-Agent": UA}
    ok = True
    for name, issue_id in (only or LOG_ISSUES):
        try:
            req = urllib.request.Request(
                f"{api}/api/issues/{issue_id}/comments", method="POST",
                data=json.dumps({"body": body}).encode(), headers=hdrs)
            with urllib.request.urlopen(req, timeout=30) as r:
                json.load(r)
            print(f"LOGGED msg-ids on {name}.")
        except Exception as e:
            ok = False
            print(f"WARN: could not log msg-ids on {name} ({e}). "
                  f"Post them from {RESULTS_FILE} by hand.")
    return ok


def log_archive_result(archived):
    """Post the archive outcome as a short follow-up to the msg-id comment on DAN-2145.

    Exists because the msg-id comment is now written BEFORE the archive (see the tail of
    __main__), so it can only say "archive pending". This closes that loop. Best-effort
    and DAN-2145 only — DAN-1737 needs the msg-ids, not the routine bookkeeping.
    """
    api, key = os.environ.get("PAPERCLIP_API_URL"), os.environ.get("PAPERCLIP_API_KEY")
    if not (api and key):
        return False
    body = (f"Routine `{ROUTINE_ID}` — **archived**, verified by read-back. Cannot re-fire "
            "2027-07-21." if archived else
            f"⚠️ Routine `{ROUTINE_ID}` — **archive FAILED, it is STILL ARMED.** Its cron "
            "`0 9 21 7 *` is a yearly pattern: left as-is it re-sends Email-3 to all three "
            "editors on 2027-07-21. Archive it by hand today — `PATCH /api/routines/{id}` "
            "`{\"status\":\"archived\"}`, then confirm with an independent GET.")
    try:
        req = urllib.request.Request(
            f"{api}/api/issues/{LOG_ISSUES[0][1]}/comments", method="POST",
            data=json.dumps({"body": body}).encode(),
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json",
                     "User-Agent": UA})
        with urllib.request.urlopen(req, timeout=30) as r:
            json.load(r)
        print("LOGGED archive outcome on DAN-2145.")
        return True
    except Exception as e:
        print(f"WARN: could not log archive outcome on DAN-2145 ({e}).")
    return False


def archive_routine():
    """Disarm the firing routine immediately after a successful send.

    Its cron `0 9 21 7 *` is a YEARLY pattern, not a true one-shot: left active it
    silently re-arms for 2027-07-21 and re-sends to all three editors. Step 5 asked a
    human to remember this. Doing it here means the re-send window closes in the same
    breath as the send, even if the fire-time agent dies right after step 3.
    Best-effort: a failure here must never mask a successful send, so it only warns.

    Disarm is confirmed by an independent GET, never by the PATCH echo — this API is
    known to accept a write, echo it back, and silently drop the field. If the status
    write does not stick, fall back to disabling the schedule trigger, which is the
    thing that actually causes the 2027 re-fire.

    MEASURED 2026-07-20 (T-25h) against a throwaway scratch routine, not assumed:
    `PATCH {"status": "archived"}` → 200 and an independent GET reads back
    `status == "archived"`. The primary path works; the trigger-disable fallback is a
    backstop that has NOT been exercised (the create route silently dropped triggers[]
    on the scratch routine, so there was nothing to disable). Note also that GET can
    return `triggers: []` — `disarmed()` then returns False on the fallback branch even
    if the routine is in fact dead. That mis-fires toward a false "STILL ARMED" warning,
    never a false success, which is the correct direction. `DELETE /api/routines/{id}`
    404s, so scratch routines can only be archived, never removed.
    """
    api, key = os.environ.get("PAPERCLIP_API_URL"), os.environ.get("PAPERCLIP_API_KEY")
    if not (api and key):
        print("WARN: PAPERCLIP_API_URL/KEY unset — could not auto-archive. "
              f"ARCHIVE ROUTINE {ROUTINE_ID} BY HAND or it re-fires 2027-07-21.")
        return False

    hdrs = {"Authorization": f"Bearer {key}", "Content-Type": "application/json",
            "User-Agent": UA}
    url = f"{api}/api/routines/{ROUTINE_ID}"

    def patch(payload):
        req = urllib.request.Request(url, method="PATCH",
                                     data=json.dumps(payload).encode(), headers=hdrs)
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.load(r)

    def disarmed():
        """Independent read-back. True only if it can no longer fire."""
        req = urllib.request.Request(url, headers=hdrs)
        with urllib.request.urlopen(req, timeout=30) as r:
            got = json.load(r)
        if got.get("status") == "archived":
            return True
        trigs = got.get("triggers") or []
        return bool(trigs) and all(
            not t.get("enabled") or not t.get("nextRunAt") for t in trigs)

    try:
        patch({"status": "archived"})
        if disarmed():
            print(f"ARCHIVED routine {ROUTINE_ID} — verified by read-back, "
                  "cannot re-fire 2027-07-21.")
            return True

        # Status write did not stick. Kill the trigger instead.
        print("WARN: status=archived did not stick on read-back — the API dropped it. "
              "Falling back to disabling the schedule trigger.")
        patch({"triggers": [{"id": TRIGGER_ID, "enabled": False}]})
        if disarmed():
            print(f"DISARMED routine {ROUTINE_ID} via trigger disable — verified by "
                  "read-back, cannot re-fire 2027-07-21.")
            return True

        print(f"WARN: routine {ROUTINE_ID} is STILL ARMED after both archive and "
              "trigger-disable attempts. ARCHIVE IT BY HAND or it re-sends to all "
              "three editors on 2027-07-21.")
    except Exception as e:
        print(f"WARN: auto-archive failed ({e}). "
              f"ARCHIVE ROUTINE {ROUTINE_ID} BY HAND or it re-fires 2027-07-21.")
    return False


LBS_ISSUE = ("DAN-2553", "6ee21d1b-dfaa-4489-89e0-b842971d08d8")


def unblock_lbs(delivered, msgids_logged):
    """Runbook step 5's last limb: flip the LBS live-link verification issue to `todo`.

    Same failure shape as the archive this function sits next to — step 5 asked a human
    to remember it, and the routine fires headless at 09:00Z with nobody watching. If the
    fire-time run dies after step 4, DAN-2553 stays `blocked` forever, its D+7 window
    (2026-07-28) passes unobserved, and the wave closes with nobody ever checking whether
    a link went live. Nothing else in the system flips it: there is no blockers route, so
    the unblock condition lives in prose in the issue body and only a status write clears
    it.

    Two guards, both deliberate:
    * `delivered` — if not a single send succeeded there is nothing to verify. Unblocking
      then sends LBS hunting for links from a pitch no editor ever received.
    * `msgids_logged` — DAN-2553's body says "do not start until DAN-2145 shows the
      Email-3 msg-id table". Unblocking before that comment lands would hand LBS a task
      whose own stated precondition is still unmet, and LBS has no way to tell the
      difference between "not posted yet" and "never posted".

    Best-effort and verified by an independent GET, never the PATCH echo — this API is
    known to accept a write, echo it, and drop the field.
    """
    name, issue_id = LBS_ISSUE
    if not delivered:
        print(f"NOTE: no send succeeded — leaving {name} blocked (nothing to verify).")
        return False
    if not msgids_logged:
        print(f"WARN: msg-ids did not land on the board — leaving {name} blocked, since "
              f"its stated precondition is the DAN-2145 msg-id table. Post the table from "
              f"{RESULTS_FILE}, then flip {name} to todo by hand.")
        return False

    api, key = os.environ.get("PAPERCLIP_API_URL"), os.environ.get("PAPERCLIP_API_KEY")
    if not (api and key):
        print(f"WARN: PAPERCLIP_API_URL/KEY unset — could not unblock {name}. "
              "Flip it blocked→todo by hand or the D+7 link check never happens.")
        return False

    hdrs = {"Authorization": f"Bearer {key}", "Content-Type": "application/json",
            "User-Agent": UA}
    url = f"{api}/api/issues/{issue_id}"
    try:
        req = urllib.request.Request(url, method="PATCH",
                                     data=json.dumps({"status": "todo"}).encode(),
                                     headers=hdrs)
        with urllib.request.urlopen(req, timeout=30) as r:
            json.load(r)
        req = urllib.request.Request(url, headers=hdrs)
        with urllib.request.urlopen(req, timeout=30) as r:
            got = json.load(r)
        status = (got.get("issue") or got).get("status")
        if status == "todo":
            print(f"UNBLOCKED {name} (blocked→todo) — verified by read-back. "
                  "LBS owns D+7 2026-07-28 / D+14 2026-08-04 live-link verification.")
            return True
        print(f"WARN: {name} still reads status={status!r} after the write — the API "
              "dropped it. Flip it blocked→todo by hand or the D+7 link check never "
              "happens.")
    except Exception as e:
        print(f"WARN: could not unblock {name} ({e}). Flip it blocked→todo by hand "
              "or the D+7 link check never happens.")
    return False


def fetch(url, follow=False):
    """Return (status, body). follow=False surfaces 3xx instead of chasing it."""
    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, *a, **kw):
            return None
    opener = urllib.request.build_opener() if follow else urllib.request.build_opener(NoRedirect)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with opener.open(req, timeout=30) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")


def first_h1(html):
    import re
    m = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S | re.I)
    if not m:
        return None
    return re.sub(r"<[^>]+>", "", m.group(1)).strip()


def preflight():
    """Step 2: every URL must be a DIRECT 200 (no redirect) with a matching H1,
    and the known-bad control must 404 (proves the soft-200 bug has not regressed)."""
    ok = True
    print("=== PREFLIGHT (step 2) ===")
    for t in TARGETS:
        status, html = fetch(t["url"])
        h1 = first_h1(html) if status == 200 else None
        h1_ok = bool(h1 and t["h1_must_contain"].lower() in h1.lower())
        good = status == 200 and h1_ok
        ok &= good
        print(f"{'PASS' if good else 'FAIL'}  {status:3}  {t['url']}")
        print(f"        H1: {h1!r}  (expect to contain {t['h1_must_contain']!r})")
        if status in (301, 302, 307, 308):
            print("        ^^ SLUG MOVED — find the direct-200 form before sending.")

    status, _ = fetch(CONTROL_404_URL)
    ctrl_ok = status == 404
    ok &= ctrl_ok
    print(f"{'PASS' if ctrl_ok else 'FAIL'}  {status:3}  {CONTROL_404_URL}  (control: must be 404)")
    if not ctrl_ok:
        print("        ^^ SOFT-200 BUG REGRESSED — the 200s above prove nothing. DO NOT SEND.")
    print(f"=== PREFLIGHT {'PASS' if ok else 'FAIL'} ===")
    return ok


# DAN-1991 identity lock. Asserted, not assumed: Resend returns HTTP 200 and delivers
# happily from a stale FROM, so a wrong sender is invisible at send time and only shows
# up on the recipient's screen. This already happened once — prospect mail went out from
# the retired dani@revieweriq.com, both delivered, nothing alerted. Env is not trusted.
#
# DAN-2547's "interim fix" (aversusb.net) was REVERTED 2026-07-20 by live probe, not by
# argument. Both domains were POSTed to the real Resend API with the key actually in env
# (re_MmBBZs...zWZT), recipient daniarozin@gmail.com:
#   from aversusb-mail.com -> HTTP 200, id 9a151ce2-3338-42d2-90e3-5a0d56b8eba8
#   from aversusb.net      -> HTTP 403 "This API key is not authorized to send emails
#                             from aversusb.net"
# DAN-2547 reasoned from the OLD key (re_Fd1z17fC_), which rotated on 2026-07-13. Under
# the interim value this script aborts on the env mismatch, and would 403 even if env
# matched — i.e. zero Email-3 sends. aversusb.net is also the WEB APP's address, which
# the DAN-1991 lock exists to keep out of outreach.
LOCKED_FROM = "A Versus B <hello@aversusb-mail.com>"
LOCKED_REPLY_TO = "daniarozin@gmail.com"


def assert_identity():
    """Refuse to send under a non-canonical sender. Raises; never warns."""
    problems = []
    if (FROM or "").strip() != LOCKED_FROM:
        problems.append(f"RESEND_FROM_EMAIL is {FROM!r}, must be {LOCKED_FROM!r}")
    if (REPLY or "").strip() != LOCKED_REPLY_TO:
        problems.append(f"RESEND_REPLY_TO is {REPLY!r}, must be {LOCKED_REPLY_TO!r}")
    for bad in ("revieweriq.com", "aversusb.net"):
        if bad in (FROM or ""):
            problems.append(f"FROM contains banned outreach domain {bad!r} "
                            "(DAN-1991 lock) — this is the web app's address, not BD's")
    if problems:
        raise SystemExit("ABORT: sender identity violates the DAN-1991 lock:\n  - "
                         + "\n  - ".join(problems)
                         + "\nFix the environment; do NOT edit the lock to match.")
    print(f"IDENTITY OK: from={FROM} reply_to={REPLY} (DAN-1991 lock)")


def send(targets, persist):
    assert_identity()
    # `persist` is called after EVERY recipient, before the 45s spacing sleep. The results
    # file is the idempotency guard, so it has to exist the moment the first email is
    # actually in flight — not after the whole loop. Otherwise a kill during the ~90s of
    # sleeps leaves recipient 1 sent with no guard on disk, and the next run re-sends them.
    results = []
    for i, t in enumerate(targets):
        payload = {
            "from": FROM, "to": [t["to"]], "reply_to": REPLY,
            "subject": t["subject"],
            "text": BODY.format(first=t["first"], topic=t["topic"], url=t["url"]),
        }
        req = urllib.request.Request(
            "https://api.resend.com/emails",
            data=json.dumps(payload).encode(),
            headers={"Authorization": f"Bearer {KEY}",
                     "Content-Type": "application/json",
                     "User-Agent": UA},   # Resend is Cloudflare-fronted; default UA → 403 err 1010
            method="POST")
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                body = json.loads(r.read().decode())
                results.append({"to": t["to"], "status": r.status, "id": body.get("id"),
                                "subject": t["subject"], "url": t["url"]})
                print(f"OK   {r.status}  {t['to']}  id={body.get('id')}")
        except Exception as e:
            detail = e.read().decode()[:300] if hasattr(e, "read") else str(e)
            results.append({"to": t["to"], "status": "ERROR", "error": detail})
            print(f"FAIL {t['to']}: {detail}")
        persist(results)
        if i < len(targets) - 1:
            time.sleep(45)
    return results


if __name__ == "__main__":
    args = sys.argv[1:]
    if "--reply-check" in args:
        _, verified = reply_check(TARGETS)
        sys.exit(0 if verified else 4)
    if "--send" not in args:
        ok = preflight()
        print()
        reply_check(TARGETS)
        # Credential readiness. Until 2026-07-20 T-25h --preflight never looked at the
        # send vars, so it could print PREFLIGHT PASS while --send would die instantly on
        # "ABORT: unset env var(s)". Preflight is the confidence check we actually re-run,
        # so it has to be predictive of the send. Reported, not fatal: a preflight from a
        # shell without the BD creds is still a legitimate URL/H1 check.
        print()
        cred_missing = [n for n, v in (("RESEND_API_KEY", KEY), ("RESEND_FROM_EMAIL", FROM),
                                       ("RESEND_REPLY_TO", REPLY)) if not v]
        if cred_missing:
            print(f"SEND VARS: MISSING {', '.join(cred_missing)} — --send would ABORT (exit 3).")
        elif FROM != LOCKED_FROM or REPLY != LOCKED_REPLY_TO:
            print("SEND VARS: set, but DAN-1991 identity lock FAILS — --send would ABORT.")
            print(f"  RESEND_FROM_EMAIL={FROM!r} (want {LOCKED_FROM!r})")
            print(f"  RESEND_REPLY_TO={REPLY!r} (want {LOCKED_REPLY_TO!r})")
        else:
            print(f"SEND VARS: all three set, DAN-1991 identity lock PASSES (from={FROM}).")

        # Post-send credential readiness. RESEND_* only gates step 3; PAPERCLIP_API_*
        # gates steps 4 and 5 — and step 5 is the irreversible one. `0 9 21 7 *` is a
        # YEARLY cron, so if auto-archive silently no-ops the routine re-arms and
        # re-sends Email-3 to all three editors on 2027-07-21 with nobody watching.
        # Both post-send paths degrade to a WARN on stdout, which the headless 09:00Z
        # run prints into a log no human reads. Surfacing it here — the check we
        # actually re-run before the fire — is the only place it gets seen in time.
        print()
        if os.environ.get("PAPERCLIP_API_URL") and os.environ.get("PAPERCLIP_API_KEY"):
            print("POST-SEND VARS: PAPERCLIP_API_URL/KEY set — step-4 msg-id logging and "
                  f"step-5 auto-archive of routine {ROUTINE_ID} can run.")
        else:
            print("POST-SEND VARS: ⚠️ PAPERCLIP_API_URL/KEY unset — the send still works, "
                  "but msg-ids will NOT be logged and the routine will NOT be archived.")
            print(f"  Then archive {ROUTINE_ID} BY HAND, same day: "
                  "PATCH /api/routines/{id} {\"status\":\"archived\"} and re-read it back. "
                  "Left armed, the yearly cron re-sends on 2027-07-21.")
        sys.exit(0 if ok else 1)

    missing = [n for n, v in (("RESEND_API_KEY", KEY), ("RESEND_FROM_EMAIL", FROM),
                              ("RESEND_REPLY_TO", REPLY)) if not v]
    if missing:
        print(f"ABORT: unset env var(s): {', '.join(missing)}. Cannot send.")
        sys.exit(3)

    # Idempotency guard (runbook step 4 / guardrail): never double-send.
    if os.path.exists(RESULTS_FILE):
        prior = json.load(open(RESULTS_FILE))
        # Only a non-ERROR status means the email actually left. Counting ERROR rows as
        # "done" would silently retire a recipient who never received anything — a
        # transient Resend 429 on one address used to read back as "COMPLETED 3/3".
        done = [s["to"] for s in prior.get("sends", []) if s.get("status") != "ERROR"]
        failed = [s["to"] for s in prior.get("sends", []) if s.get("status") == "ERROR"]
        print(f"ABORT: {RESULTS_FILE} exists — Email-3 already fired. Never re-send blind.")
        # Responders dropped by the prior run are NOT "still owed" — they are the one
        # group the guardrail forbids emailing. Without this, a run that dropped a
        # responder AND had a send failure listed that responder under "Still owed" and
        # emitted a retry command that would deliver Email-3 straight to them.
        prior_dropped = {a.lower() for a in prior.get("dropped", [])}
        remaining = [t["to"] for t in TARGETS
                     if t["to"] not in done and t["to"].lower() not in prior_dropped]
        if prior_dropped:
            print(f"  Dropped as RESPONDERS — never email: {', '.join(sorted(prior_dropped))}")
        if prior.get("complete") and not failed:
            print(f"  Run COMPLETED: {len(done)}/{prior.get('expected')} recipients.")
        else:
            # Either the run died mid-loop, or it finished with per-recipient failures.
            # Both cases leave real addresses unsent. These addresses ARE sent.
            why = "finished with FAILURES" if prior.get("complete") else "died mid-loop (PARTIAL)"
            print(f"  Run {why}: {len(done)}/{prior.get('expected')} actually sent.")
            if failed:
                print(f"  Send FAILED for (never delivered): {', '.join(failed)}")
            print(f"  Already sent (do NOT repeat): {', '.join(done) or 'none'}")
            print(f"  Still owed: {', '.join(remaining) or 'none'}")
            print("  To finish, move the results file aside and re-run with:")
            print(f"    --send --drop {' '.join(done + sorted(prior_dropped))}")
        print(json.dumps(prior, indent=2))
        sys.exit(2)

    # A hand-typed --drop address is the ONLY thing standing between a responder and an
    # email we promised not to send them. Until now an address that matched no recipient
    # was accepted in silence and still printed "DROPPED (responder): <addr>" below — so a
    # typo (kob@ for kob.monney@) read back as a successful drop and then emailed Kob
    # anyway. Fail loud instead: an unrecognised drop means the operator's intent and the
    # recipient list disagree, and guessing which one is right is not our call.
    # Flags are skipped so `--drop <addr> --send` (reversed order) still parses.
    if "--drop" in args:
        drop = {a.lower() for a in args[args.index("--drop") + 1:] if not a.startswith("--")}
    else:
        drop = set()
    known = {t["to"].lower() for t in TARGETS}
    unknown = sorted(drop - known)
    if unknown:
        print(f"ABORT: --drop address(es) match no recipient: {', '.join(unknown)}")
        print(f"  Recipients are: {', '.join(sorted(known))}")
        print("  Nothing was sent. Fix the address and re-run.")
        sys.exit(5)
    auto_drop, reply_verified = reply_check(TARGETS)
    drop |= auto_drop
    targets = [t for t in TARGETS if t["to"].lower() not in drop]
    for d in sorted(drop):
        print(f"DROPPED (responder): {d}")
    if not targets:
        print("Nothing to send — all recipients dropped as responders.")
        sys.exit(0)

    if not preflight():
        print("ABORT: preflight failed. Fix the URL(s) and re-run.")
        sys.exit(1)

    reply_note = ("VERIFIED against a live inbox (control query non-zero)" if reply_verified
                  else "UNVERIFIED at send time — Gmail dark")
    print(f"\n=== SENDING {len(targets)} ===")
    print(f"reply status: {reply_note}")

    # Persist the reply-blind flag next to the msg-ids so the provenance survives the run
    # and can never be silently rounded up to a '0 replies' measurement later.
    # `dropped` is persisted, not just printed: it is the only record that these
    # addresses were withheld deliberately (responders) rather than left unsent. A later
    # guard run that cannot see it treats them as still-owed and hands out a retry
    # command that emails the very people we must not email.
    def persist(results, complete=False):
        json.dump({"reply_status": reply_note, "reply_verified": reply_verified,
                   "complete": complete, "expected": len(targets),
                   "dropped": sorted(drop), "sends": results},
                  open(RESULTS_FILE, "w"), indent=2)

    results = send(targets, persist)
    # "complete" means the loop ran to the end, NOT that every send succeeded — those are
    # different facts and conflating them is how a failed recipient reads back as sent.
    failed_sends = [r["to"] for r in results if r.get("status") == "ERROR"]
    payload = {"reply_status": reply_note, "reply_verified": reply_verified,
               "complete": True, "all_delivered": not failed_sends,
               "failed": failed_sends, "expected": len(targets),
               "dropped": sorted(drop), "sends": results}
    json.dump(payload, open(RESULTS_FILE, "w"), indent=2)
    print(f"\n--- written to {RESULTS_FILE} ---")
    # ORDER MATTERS, and it is the reverse of the runbook's numbering. Step 4 (msg-ids)
    # and step 5's LBS flip run BEFORE the archive.
    #
    # This routine archives ITSELF while its own run is still in flight. Whether the
    # control plane terminates an in-flight run when its routine is archived is not
    # something we can test against the live one-shot without burning it, and the
    # blast radii are wildly asymmetric:
    #   archive first, and the run IS killed  -> three editors emailed, nothing on the
    #       board, DAN-2553 blocked past its D+7 window. Silent and unrecoverable in time.
    #   log first, and the run dies pre-archive -> everything recorded, and the routine
    #       stays armed for 2027-07-21 — flagged in the comment we just posted, a year of
    #       lead time to fix.
    # So the irreversible-if-lost bookkeeping goes first and the self-destruct goes last.
    # `archived=None` renders the comment's routine line as "archive pending" plus an
    # instruction to check by hand if no follow-up appears.
    payload["msgids_logged"] = log_msgids(results, reply_note, None)
    json.dump(payload, open(RESULTS_FILE, "w"), indent=2)
    # Gated on the msg-id table actually landing — that table is DAN-2553's stated
    # precondition, so unblocking ahead of it would hand LBS a task it was told not to start.
    payload["lbs_unblocked"] = unblock_lbs(
        delivered=bool([r for r in results if r.get("id")]),
        msgids_logged=payload["msgids_logged"])
    json.dump(payload, open(RESULTS_FILE, "w"), indent=2)
    # Last: disarm. Anything after this line may not execute if the archive kills the run.
    payload["routine_archived"] = archive_routine()
    json.dump(payload, open(RESULTS_FILE, "w"), indent=2)
    log_archive_result(payload["routine_archived"])
    print(f"NEXT: verify the msg-id comment landed on DAN-2145 + DAN-1737 "
          f"(reply status: {reply_note}).")
    if not reply_verified:
        print("      These sends must NEVER be counted toward a '0 replies' claim "
              "(0 replies is a floor, not a measurement — report raw counts, never rates).")
    print("      Then CONFIRM routine 2caeede7 is archived (yearly cron — re-arms for 2027 if left"
          "active), CONFIRM DAN-2553 reads todo (LBS owns D+7/D+14 link verification — this "
          "script flips it, but only if the send landed AND the msg-ids posted), and mark "
          "DAN-2145 done. Do NOT file a second LBS issue; DAN-2553 already exists.")
    if failed_sends:
        # Do NOT let a partial failure close out as a clean sequence. The routine is
        # already archived by this point (correct — it must never re-fire wholesale),
        # so the only path for these addresses is a deliberate manual re-run.
        print(f"\n⚠️  {len(failed_sends)} SEND(S) FAILED — NOT delivered: {', '.join(failed_sends)}")
        print("    Do NOT report Email-3 as fully sent and do NOT mark DAN-2145 done yet.")
        print("    To retry ONLY the failures, move the results file aside and re-run with:")
        # Must carry the responder drops too — they are absent from `results` entirely,
        # so a retry built only from the sent rows would re-include them.
        retry_drop = [r["to"] for r in results if r.get("status") != "ERROR"] + sorted(drop)
        print(f"      --send --drop {' '.join(retry_drop)}")
        sys.exit(5)
