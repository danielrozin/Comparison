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


def send(targets, persist):
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
        sys.exit(0 if ok else 1)

    missing = [n for n, v in (("RESEND_API_KEY", KEY), ("RESEND_FROM_EMAIL", FROM),
                              ("RESEND_REPLY_TO", REPLY)) if not v]
    if missing:
        print(f"ABORT: unset env var(s): {', '.join(missing)}. Cannot send.")
        sys.exit(3)

    # Idempotency guard (runbook step 4 / guardrail): never double-send.
    if os.path.exists(RESULTS_FILE):
        prior = json.load(open(RESULTS_FILE))
        done = [s["to"] for s in prior.get("sends", [])]
        print(f"ABORT: {RESULTS_FILE} exists — Email-3 already fired. Never re-send blind.")
        if prior.get("complete"):
            print(f"  Run COMPLETED: {len(done)}/{prior.get('expected')} recipients.")
        else:
            # Partial file = the previous run died mid-loop. These addresses ARE sent.
            remaining = [t["to"] for t in TARGETS if t["to"] not in done]
            print(f"  Run was PARTIAL: {len(done)}/{prior.get('expected')} sent before it died.")
            print(f"  Already sent (do NOT repeat): {', '.join(done) or 'none'}")
            print(f"  Still owed: {', '.join(remaining) or 'none'}")
            print("  To finish, move the results file aside and re-run with:")
            print(f"    --send --drop {' '.join(done)}")
        print(json.dumps(prior, indent=2))
        sys.exit(2)

    drop = {a.lower() for a in args[args.index("--drop") + 1:]} if "--drop" in args else set()
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
    def persist(results, complete=False):
        json.dump({"reply_status": reply_note, "reply_verified": reply_verified,
                   "complete": complete, "expected": len(targets),
                   "sends": results}, open(RESULTS_FILE, "w"), indent=2)

    results = send(targets, persist)
    payload = {"reply_status": reply_note, "reply_verified": reply_verified,
               "complete": True, "expected": len(targets), "sends": results}
    json.dump(payload, open(RESULTS_FILE, "w"), indent=2)
    print(f"\n--- written to {RESULTS_FILE} ---")
    # Runbook step 5, automated. Deliberately AFTER the results file is written: that file
    # is the idempotency guard, so it must land first even if archiving fails.
    payload["routine_archived"] = archive_routine()
    json.dump(payload, open(RESULTS_FILE, "w"), indent=2)
    print(f"NEXT: log msg-ids on DAN-2145 + DAN-1737, and record 'reply status {reply_note}'.")
    if not reply_verified:
        print("      These sends must NEVER be counted toward a '0 replies' claim "
              "(0 replies is a floor, not a measurement — report raw counts, never rates).")
    print("      Then CONFIRM routine 2caeede7 is archived (yearly cron — re-arms for 2027 if left"
          "active) and mark DAN-2145 done; hand 7-14d link verification to LBS.")
