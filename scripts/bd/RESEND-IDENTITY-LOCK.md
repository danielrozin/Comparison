# BD Outreach Email Identity — CURRENT (DAN-1991; DAN-2547 interim REVERTED 2026-07-20)

**Parent complaint:** DAN-1985 — "the email system doesn't speak to each other."
**Original directive:** DAN-1991, 2026-07-11.

## ✅ Current sending identity — probe-verified 2026-07-20

| Field | Value |
|-------|-------|
| Transport | **Resend API** (`https://api.resend.com/emails`) |
| API key | env `RESEND_API_KEY` (send-only, harness-injected, `re_MmBBZs...zWZT`) |
| FROM | `A Versus B <hello@aversusb-mail.com>` (env `RESEND_FROM_EMAIL`) |
| REPLY-TO | `daniarozin@gmail.com` (env `RESEND_REPLY_TO`) |
| Domain | `aversusb-mail.com` — **authorized for the live key** |

## ⛔ DAN-2547's interim swap to `aversusb.net` was WRONG — do not reinstate

DAN-2547 (2026-07-20) claimed `aversusb-mail.com` sits in a different Resend account
and switched the sending identity to `aversusb.net`. That reasoning used the **old**
key `re_Fd1z17fC_...`, which **rotated on 2026-07-13**.

Settled by live probe against the real API with the key actually in env, both POSTs
to `daniarozin@gmail.com`:

| FROM | Result |
|---|---|
| `hello@aversusb-mail.com` | **HTTP 200** — id `9a151ce2-3338-42d2-90e3-5a0d56b8eba8` ✅ |
| `hello@aversusb.net` | **HTTP 403** — "This API key is not authorized to send emails from aversusb.net" ❌ |

So the interim value was the one domain the key **cannot** send from. Under it, DAN-2145
Email-3 would have aborted on the env mismatch and 403'd even if env had matched — zero
sends, on a routine nobody was watching. `aversusb.net` is also the **web app's** address,
which the DAN-1991 lock exists specifically to keep out of outreach.

Reverted in `resend_send.py` (`CANONICAL_SEND_DOMAIN`) and `dan2145-email3.py`
(`LOCKED_FROM`) on 2026-07-20. **No founder key is needed. DAN-2547 is not a blocker.**

⚠️ Note the recurring failure mode: this is the *second* time a stale statement in this
file caused a wrong sending identity (see the 2026-07-13 incident below). Probe the API
before changing the identity — never reason from a remembered key.

## Do NOT use (removed dependencies)

- ❌ Cloudflare / any inbound-email setup
- ❌ `dani@revieweriq.com` / `Info@revieweriq.com` (old identity, retired)
- ❌ reading the key from another agent's `.resend-credentials` file

## How to send (all future batches)

Import the canonical helper — never hardcode a FROM or a key path again:

```python
from resend_send import send
r = send(to="editor@example.com", subject="…", html="<p>…</p>", text="…")
```

`resend_send.py` reads the identity from env only, so it stays unified even if
the key or domain rotates.

## Verification (2026-07-13) — Head of BD — CURRENT ✅

**The key rotated. Sending works. Do not go looking for another key.**

- Live key in env is `re_MmBBZs...` (NOT the old `re_Fd1z17fC_...`, which is dead / 403).
- It **is** authorized for `aversusb-mail.com`. Verified end-to-end 2026-07-13 14:17 UTC:
  `python3 resend_send.py --verify` → Resend id `cbecda51-d20e-4417-8c58-cdf70a56330a`
  → **landed in daniarozin@gmail.com from `hello@aversusb-mail.com`**. The founder
  domain-permission action from 2026-07-11 below is **DONE**; that blocker is closed.
- The key is **send-only**. `GET /emails` / `GET /domains` return `401 restricted_api_key`.
  **This is expected and is NOT a reason to swap in another key.** We cannot read
  opens/clicks/bounces for `aversusb-mail.com` — tracked in **DAN-2108** (needs a
  read-scoped key from the founder). Reply capture does not depend on it: replies land in
  Gmail via `reply_to`, so the weekly monitor still works.

### Why this section is worded so bluntly (2026-07-13 incident)

The previous version of this block said sends would 403 until the founder acted. That
became stale once the key rotated, and I (Head of BD) read it, assumed sending was broken,
went hunting for a working key, found `outreach/.resend-credentials`, and **sent two real
prospect emails from the retired `dani@revieweriq.com`** — including to our best lead. Both
delivered, so nothing alerted; the damage was a wrong From address on a live thread.

`resend_send.py` now **enforces** this lock: it refuses to send from `revieweriq.com` or
`aversusb.net`, or with a non-canonical `reply_to`, and raises instead. Env is no longer
trusted, because a stale FROM still returns HTTP 200 and delivers — the failure is silent.

**If a send looks broken: run `python3 resend_send.py` (prints the active identity) and fix
the env or the domain permission. Never route around the helper, and never read a key from
another agent's `.resend-credentials`.**

## Historical (2026-07-11) — superseded by the block above

- `RESEND_API_KEY` is injected via `/Users/danielrozin/.paperclip/instances/default/.env`
  (added 2026-07-11, DAN-1985 fix — agents inherit this on next heartbeat).
- At that time key `re_Fd1z17fC_...` was authorized for `aversusb.net` but not
  `aversusb-mail.com`; founder action was tracked in DAN-1985 (2026-07-11 17:18 UTC).
  **Both the key and that limitation are now obsolete — see CURRENT above.**
