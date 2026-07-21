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
#
# ---------------------------------------------------------------------------
# CHANNEL 2 — the WordPress REST search (added 2026-07-21, pre-D+7)
# ---------------------------------------------------------------------------
# Yanko Design's HTML search has returned 403 on 07-14, 07-16 and 07-21 and had
# never once been DOM-verified, so row 2 was on course to be UNVERIFIED at D+7
# AND D+14 — i.e. wave-1 would end with no verdict for that outlet at all.
#
# All three outlets run WordPress and expose /wp-json/wp/v2/search. On Yanko that
# endpoint returns 200 JSON even while /?s= returns the Cloudflare wall — it is
# not behind the same rule. It is also structurally immune to two of the traps
# above: there is no HTML to echo the query back (T1) and the count is an array
# length rather than a card count (T3).
#
# Validated on 2026-07-21 before being trusted — an empty [] means nothing until
# the endpoint is shown to find things that ARE there:
#   substring semantics  ?search=ickstarter -> 20, ?search=amsung -> 20
#                        so matching is LIKE %term%, and the TLD-less term
#                        `aversusb` therefore does match the string aversusb.net
#   URL-in-body matching ?search=kickstarter.com -> 20 (yanko)
#                        ?search=amazon.co.uk    -> 20 (trustedreviews)
#                        ?search=netflix.com     -> 20 (cordcutters)
#                        so a bare domain inside article copy IS matched — which
#                        is exactly the shape of the placement we are looking for
#   negative control     ?search=zzqqxxnotarealterm -> 0 on all three, so the
#                        endpoint is not simply ignoring the search parameter
#
# C1/C2 — BOTH controls are load-bearing and re-run on every sweep, because an
# endpoint that dies or starts ignoring ?search would otherwise hand back a
# permanent, confident 0. A target 0 is trusted ONLY when the positive control
# returns >0 AND the negative control returns 0 on that same run. Cord Cutters
# already threw a transient http=000 on a control during validation, so this is
# a live failure mode, not a hypothetical one. The counts are always printed.
#
# Scope limit, stated honestly: /wp/v2/search covers public, REST-exposed post
# content. It would not see a link placed only in a sidebar widget, a theme
# template or a comment. It is authoritative for an in-article placement, which
# is what was pitched — so a REST zero is reported as VERIFIED-ZERO (REST).

set -uo pipefail

LABEL="${1:-adhoc}"
STAMP="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
TODAY="$(date -u +%Y-%m-%d)"
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
MIN_BYTES=500

# T1 — the query term is TLD-less on purpose; the hit pattern demands the TLD.
#
# Both are overridable ONLY so the harness can be fire-drilled against a term
# that is known to be present (see FIRE DRILL below). A sweep that has only ever
# printed "zero" has not been shown to be capable of printing anything else, and
# an always-zero detector is indistinguishable from a working one until the day
# a link actually lands and it silently misses it. Leave the defaults alone for
# a real sweep — overriding QUERY_TERM to `aversusb.net` re-arms trap T1.
#
#   FIRE DRILL (re-run after ANY edit to the matching logic):
#     SWEEP_QUERY_TERM=kickstarter SWEEP_HIT_RE='kickstarter\.com' \
#       bash scripts/bd/dan2583-link-sweep.sh firedrill
#   Expect LINKED on Yanko Design and exit 10. If that prints VERIFIED-ZERO,
#   the detector is broken and every past zero in this issue is worthless.
QUERY_TERM="${SWEEP_QUERY_TERM:-aversusb}"
HIT_RE="${SWEEP_HIT_RE:-aversusb\.net}"

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

# Channel 2 — outlet | WP REST origin | positive-control term (known present)
declare -a REST_OUTLETS=(
  "Trusted Reviews|https://www.trustedreviews.com|amazon.co.uk"
  "Yanko Design|https://www.yankodesign.com|kickstarter.com"
  "Cord Cutters News|https://cordcuttersnews.com|netflix.com"
)
NEG_CONTROL='zzqqxxnotarealterm'

# Count results from /wp/v2/search. Echoes a bare integer, or -1 on any failure
# (non-2xx, unparseable, or a JSON shape that is not the expected array) so a
# broken read can never be mistaken for a zero.
rest_count () { # origin, term
  local f code
  f="$(mktemp -t dan2583restXXXXXX)"   # R3 — fresh file here too.
  code="$(curl -sS -L --max-time 30 -A "$UA" -H 'Accept: application/json' \
            -o "$f" -w '%{http_code}' \
            "${1}/wp-json/wp/v2/search?search=${2}&per_page=20" 2>/dev/null)"
  if [ "$?" -ne 0 ] || [ "${code:-0}" -lt 200 ] || [ "${code:-0}" -ge 300 ]; then
    echo -1; return
  fi
  python3 -c "
import json,sys
try:
    d=json.load(open('$f'))
    print(len(d) if isinstance(d,list) else -1)
except Exception:
    print(-1)
" 2>/dev/null || echo -1
}

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

  # Channel 1 sets a verdict; it no longer scores the row on its own. The row is
  # scored once, after channel 2 has also reported. HTML=UNVERIFIED + REST=zero
  # is precisely the Yanko Design case this second channel was added to rescue.
  html_verdict="UNVERIFIED"

  # R4 — the trust gate. Everything downstream is gated on this single boolean.
  if ! { [ "$rc" -eq 0 ] && [ "${http_code:-0}" -ge 200 ] && [ "${http_code:-0}" -lt 300 ] \
         && [ "${bytes:-0}" -gt "$MIN_BYTES" ]; }; then
    # R6 — a block, a timeout, or a stub body is NOT a zero.
    echo "   html:  UNVERIFIED (fetch failed the trust gate: rc=${rc} http=${http_code} bytes=${bytes})"

  # T2 — a bot wall can still be served with a 2xx.
  elif grep -qiE "$INTERSTITIAL_RE" "$body"; then
    echo "   html:  UNVERIFIED (bot-wall interstitial — not a zero)"

  # T1 — requires the TLD, so the page's own query echo cannot trigger this.
  elif grep -qi "$HIT_RE" "$body"; then
    html_verdict="LINKED"
    echo "   html:  LINKED — aversusb.net reference observed"
    for form in "${TARGET_FORMS[@]}"; do
      grep -qi "$form" "$body" && echo "     ↳ target form matched: ${form}"
    done
    grep -o "aversusb\.net.\{0,100\}" "$body" | head -5 | sed 's/^/       ctx: /'

  # T3 — only the outlet's own explicit zero marker earns VERIFIED-ZERO. A 2xx
  # page that says neither yes nor no is ambiguous and stays UNVERIFIED.
  elif grep -qiE "$zero_re" "$body"; then
    html_verdict="ZERO"
    echo "   html:  VERIFIED-ZERO — outlet search returned its explicit no-results marker"
  else
    echo "   html:  UNVERIFIED (2xx body, but neither a ${HIT_RE} hit nor a zero-result marker)"
  fi

  # ---- Channel 2: WP REST search, gated on BOTH controls (C1/C2) ----------
  rest_verdict="UNVERIFIED"
  origin=""
  pos_term=""
  for rrow in "${REST_OUTLETS[@]}"; do
    if [ "${rrow%%|*}" = "$outlet" ]; then
      rrest="${rrow#*|}"; origin="${rrest%%|*}"; pos_term="${rrest#*|}"
    fi
  done

  if [ -n "$origin" ]; then
    pos_n="$(rest_count "$origin" "$pos_term")"
    neg_n="$(rest_count "$origin" "$NEG_CONTROL")"
    tgt_n="$(rest_count "$origin" "$QUERY_TERM")"
    # Controls are always printed — a bare target count is not evidence.
    echo "   rest:  control+(${pos_term})=${pos_n}  control-(${NEG_CONTROL})=${neg_n}  target(${QUERY_TERM})=${tgt_n}"

    if [ "$pos_n" -le 0 ] || [ "$neg_n" -ne 0 ]; then
      echo "          UNVERIFIED — controls failed, so the target count is not evidence"
    elif [ "$tgt_n" -lt 0 ]; then
      echo "          UNVERIFIED — target read failed"
    elif [ "$tgt_n" -gt 0 ]; then
      rest_verdict="LINKED"
      echo "          LINKED — ${tgt_n} REST result(s) match ${QUERY_TERM}"
      curl -sS -L --max-time 30 -A "$UA" -H 'Accept: application/json' \
        "${origin}/wp-json/wp/v2/search?search=${QUERY_TERM}&per_page=20" 2>/dev/null \
        | python3 -c "
import json,sys
try:
    for it in json.load(sys.stdin)[:10]:
        print('       hit: %s  %s' % (it.get('url',''), (it.get('title') or '')[:70]))
except Exception:
    print('       (could not list hits — open the search URL by hand)')
"
    else
      rest_verdict="ZERO"
      echo "          VERIFIED-ZERO (REST) — controls passed and the target count is 0"
    fi
  else
    echo "   rest:  UNVERIFIED (no REST origin configured for this outlet)"
  fi

  # ---- Merge. A hit on EITHER channel is a placement; a zero needs only one
  # trustworthy channel to say so; anything else stays UNVERIFIED. ------------
  if [ "$html_verdict" = "LINKED" ] || [ "$rest_verdict" = "LINKED" ]; then
    echo "   VERDICT: LINKED (html=${html_verdict} rest=${rest_verdict})"
    echo "     ↳ MANUAL FOLLOW-UP REQUIRED: open the linking article and record"
    echo "       article URL / anchor text / rel attribute / first-seen date."
    echo "       A nofollow or ugc mention still counts as a placement, but must"
    echo "       be labelled as such in the report table."
    LINKED=$((LINKED+1))
  elif [ "$html_verdict" = "ZERO" ] || [ "$rest_verdict" = "ZERO" ]; then
    echo "   VERDICT: VERIFIED-ZERO (html=${html_verdict} rest=${rest_verdict})"
    VERIFIED_ZERO=$((VERIFIED_ZERO+1))
  else
    echo "   VERDICT: UNVERIFIED (html=${html_verdict} rest=${rest_verdict}) — not a zero"
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
