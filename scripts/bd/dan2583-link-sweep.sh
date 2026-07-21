#!/usr/bin/env bash
# DAN-2583 — Wave-1 Email-3 live-link sweep harness (D+0 baseline / D+7 / D+14)
#
# Pitched 2026-07-21 06:14Z (DAN-2145, Email-3 FINAL — there is no Email-4):
#   kob.monney@trustedreviews.com  Trusted Reviews    /compare/bose-vs-jbl
#   aki@yankodesign.com            Yanko Design       /compare/ps5-pro-vs-xbox-series-x
#   jess@cordcuttersnews.com       Cord Cutters News  /compare/paramount-vs-peacock
#
# Usage:  bash scripts/bd/dan2583-link-sweep.sh <label>      e.g. d0 / d7 / d14
#
# Outputs three separate RAW COUNTS — never a rate, never a percentage:
#   LINKED         a link to aversusb.net was observed in the fetched body
#   VERIFIED-ZERO  the fetch is trustworthy AND the outlet's own zero-result
#                  marker was present. Only this counts as a real "no link".
#   UNVERIFIED     anything else — bot-block, non-2xx, short body, or a 2xx
#                  page that showed neither a hit nor a zero-marker.
#
# Why the harness is this paranoid (each rule was bought with a past false result):
#
#   R3  Fresh mktemp per URL. A 403 writes nothing, so a reused file leaves the
#       PREVIOUS outlet's body on disk and the grep scores the wrong domain.
#   R4  A grep is trusted only on curl rc=0 AND 2xx AND body >500b. Bot-wall
#       interstitials are small and must never read as a zero.
#   R5  The PS5 target has TWO slug forms — the long -performance-comparison-2026
#       form 308s to the short one and has flipped direction twice. Grepping one
#       form only scores a FALSE verified-zero, so both are matched.
#   R6  yankodesign.com is Cloudflare-walled (403 on 07-14, 07-16 and again on
#       the 07-21 D+0 baseline, `<title>Just a moment...`) and has NEVER once
#       been DOM-verified. A block stays UNVERIFIED. Never zero.
#   memory/outreach-link-verification-probes.md: the WebSearch `site:` operator
#       is NOT honoured, so it is not used here at all. The outlet's own on-site
#       search is the load-bearing check.
#
# Three further traps found by running the D+0 baseline on 2026-07-21 — all three
# had already produced a wrong verdict on the first run of this very script:
#
#   T1  QUERY-ECHO FALSE POSITIVE. A search page prints the query back at you in
#       <title>, og:title and schema.org JSON ("You searched for aversusb").
#       Grepping the body for the same term you searched for therefore ALWAYS
#       hits and scores a false LINKED — Cord Cutters did exactly this on run 1.
#       Fix: the query term deliberately OMITS the TLD (?s=aversusb) while the
#       hit pattern REQUIRES it (aversusb\.net). The echo can never satisfy it.
#       Never "fix" this by searching for aversusb.net — that re-arms the trap.
#   T2  CLOUDFLARE JSD ≠ A BLOCK. Cloudflare injects
#       /cdn-cgi/challenge-platform/scripts/jsd/main.js into ordinary, fully
#       served pages. Treating that string as an interstitial marked a perfectly
#       good 103KB Trusted Reviews results page UNVERIFIED on run 1. Detect the
#       real wall by <title>Just a moment...</title> / cf-browser-verification.
#   T3  RESULT-CARD COUNTING IS NOT A ZERO SIGNAL. The Trusted Reviews zero page
#       still renders 6 <article> cards (sidebar/recommended). Only the outlet's
#       own explicit count — "Search Results: <span>aversusb (0)" — is load-bearing.
#
# Also: do not grep these bodies with a leading-wildcard alternation such as
# `.{60}(a|b|c).{60}` — they are ~100KB on a handful of lines and it backtracks
# until it times out. Anchor on a literal prefix instead.

set -uo pipefail

LABEL="${1:-adhoc}"
STAMP="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
TODAY="$(date -u +%Y-%m-%d)"
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
MIN_BYTES=500

# T1 — the query term is TLD-less on purpose; the hit pattern demands the TLD.
QUERY_TERM='aversusb'
HIT_RE='aversusb\.net'

# R5 — both PS5 slug forms listed explicitly for per-target attribution.
declare -a TARGET_FORMS=(
  'bose-vs-jbl'
  'ps5-pro-vs-xbox-series-x'
  'ps5-pro-vs-xbox-series-x-performance-comparison-2026'
  'paramount-vs-peacock'
)

# T2 — real bot-wall markers only. NOT the bare jsd challenge-platform script.
INTERSTITIAL_RE='<title>Just a moment|cf-browser-verification|Checking your browser before accessing|Attention Required! \| Cloudflare'

# outlet | search-url | zero-result marker regex (verified against a real body)
declare -a OUTLETS=(
  # ERE, not BRE: braces bare, parens escaped to stay literal.
  "Trusted Reviews|https://www.trustedreviews.com/?s=${QUERY_TERM}|Search Results:[^(]{0,80}\(0\)"
  "Yanko Design|https://www.yankodesign.com/?s=${QUERY_TERM}|Nothing Found|No results found"
  "Cord Cutters News|https://cordcuttersnews.com/?s=${QUERY_TERM}|nothing matched your search terms"
)

LINKED=0
VERIFIED_ZERO=0
UNVERIFIED=0

echo "DAN-2583 link sweep — label=${LABEL}  run=${STAMP}"
echo "============================================================"

for row in "${OUTLETS[@]}"; do
  outlet="${row%%|*}"
  rest="${row#*|}"
  url="${rest%%|*}"
  zero_re="${rest#*|}"

  # R3 — fresh temp file per URL, every time, no reuse.
  body="$(mktemp -t dan2583XXXXXX)"

  http_code="$(curl -sS -L --max-time 40 -A "$UA" \
                 -H 'Accept: text/html,application/xhtml+xml' \
                 -o "$body" -w '%{http_code}' "$url" 2>/dev/null)"
  rc=$?
  bytes="$(wc -c < "$body" | tr -d ' ')"

  echo ""
  echo "── ${outlet}"
  echo "   url:   ${url}"
  echo "   curl:  rc=${rc} http=${http_code} bytes=${bytes} file=${body}"

  # R4 — the trust gate. Everything downstream is gated on this single boolean.
  if ! { [ "$rc" -eq 0 ] && [ "${http_code:-0}" -ge 200 ] && [ "${http_code:-0}" -lt 300 ] \
         && [ "${bytes:-0}" -gt "$MIN_BYTES" ]; }; then
    # R6 — a block, a timeout, or a stub body is NOT a zero.
    echo "   VERDICT: UNVERIFIED (fetch failed the trust gate: rc=${rc} http=${http_code} bytes=${bytes})"
    UNVERIFIED=$((UNVERIFIED+1))
    continue
  fi

  # T2 — a bot wall can still be served with a 2xx.
  if grep -qiE "$INTERSTITIAL_RE" "$body"; then
    echo "   VERDICT: UNVERIFIED (bot-wall interstitial — not a zero)"
    UNVERIFIED=$((UNVERIFIED+1))
    continue
  fi

  # T1 — requires the TLD, so the page's own query echo cannot trigger this.
  if grep -qi "$HIT_RE" "$body"; then
    echo "   VERDICT: LINKED — aversusb.net reference observed"
    for form in "${TARGET_FORMS[@]}"; do
      grep -qi "$form" "$body" && echo "     ↳ target form matched: ${form}"
    done
    echo "     ↳ MANUAL FOLLOW-UP REQUIRED: open the linking article and record"
    echo "       article URL / anchor text / rel attribute / first-seen date."
    echo "       A nofollow or ugc mention still counts as a placement, but must"
    echo "       be labelled as such in the report table."
    grep -o "aversusb\.net.\{0,100\}" "$body" | head -5 | sed 's/^/       ctx: /'
    LINKED=$((LINKED+1))
    continue
  fi

  # T3 — only the outlet's own explicit zero marker earns VERIFIED-ZERO. A 2xx
  # page that says neither yes nor no is ambiguous and stays UNVERIFIED.
  if grep -qiE "$zero_re" "$body"; then
    echo "   VERDICT: VERIFIED-ZERO — outlet search returned its explicit no-results marker"
    VERIFIED_ZERO=$((VERIFIED_ZERO+1))
  else
    echo "   VERDICT: UNVERIFIED (2xx body, but neither an aversusb.net hit nor a zero-result marker)"
    UNVERIFIED=$((UNVERIFIED+1))
  fi
done

echo ""
echo "============================================================"
echo "DAN-2583 ${LABEL} sweep — RAW COUNTS as of ${TODAY} (never rates)"
echo "  LINKED:        ${LINKED} of 3"
echo "  VERIFIED-ZERO: ${VERIFIED_ZERO} of 3"
echo "  UNVERIFIED:    ${UNVERIFIED} of 3"
echo ""
echo "Reply status for these three sends is UNVERIFIED — Gmail dark (DAN-2513 /"
echo "DAN-2546). They must NEVER be counted toward a '0 replies' claim."
echo "============================================================"

# Exit code carries the shape of the result so a caller cannot mistake a
# bot-blocked sweep for a clean zero.
if [ "$LINKED" -gt 0 ]; then exit 10; fi
if [ "$UNVERIFIED" -gt 0 ]; then exit 11; fi
exit 0
