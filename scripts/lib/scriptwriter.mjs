/**
 * Video scriptwriter.
 *
 * The script is the product. Everything else — photography, motion, type — is
 * delivery. The old pipeline generated captions by slicing the page's
 * "shortAnswer" at a character count, which produced lines like
 * "…with superior dribbling and." and a seven-line paragraph on screen.
 *
 * This writes one purpose-built line per beat, under a hard word budget,
 * against the actual numbers on the page. Claude gets the real stats and is
 * told not to invent any.
 */

import Anthropic from '@anthropic-ai/sdk';
import './env.mjs';

const MODEL = 'claude-opus-5';

/** Word budgets per beat — these are read aloud, and the band clamps at 2 lines. */
const BUDGET = {
  hook: 14,
  tape: 16,
  round: 14,
  verdict: 18,
};

const SCRIPT_SCHEMA = {
  type: 'object',
  properties: {
    hook: {
      type: 'string',
      description:
        'Cold open. A provocation or a startling number that makes someone stop scrolling. Never "In this video we will".',
    },
    tape: {
      type: 'string',
      description: 'One line framing what actually separates the two. No hedging.',
    },
    rounds: {
      type: 'array',
      description: 'One line per stat, in order. Say what the number MEANS, not what it is.',
      items: { type: 'string' },
    },
    verdict: {
      type: 'string',
      description: 'The call, plus who each option is actually for. Ends the argument.',
    },
    youtubeTitle: {
      type: 'string',
      description: 'YouTube title, under 70 characters, no clickbait caps, no year unless load-bearing.',
    },
    youtubeDescription: {
      type: 'string',
      description: 'Two or three sentences summarising the comparison for YouTube search.',
    },
  },
  required: ['hook', 'tape', 'rounds', 'verdict', 'youtubeTitle', 'youtubeDescription'],
  additionalProperties: false,
};

const SYSTEM = `You write narration for faceless head-to-head comparison videos.

House style:
- Spoken, not written. Contractions. No semicolons. No "moreover", "furthermore", "in conclusion".
- Every line earns its place. If a line could open any comparison video, rewrite it.
- Lead with the number that surprises. Numbers are the story.
- Say what a number MEANS. "899 goals" is a fact; "he scored more than anyone who ever played" is a line.
- Never invent a statistic, date, award, or claim. You may only use the figures given to you.
- No "in this video", no "let's dive in", no "stay tuned", no asking people to like and subscribe.
- Take a side in the verdict. A comparison that refuses to choose wastes the viewer's time.
- Plain ASCII punctuation only — no em dashes, no smart quotes.`;

function client() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  return new Anthropic();
}

/**
 * Generate the narration script. Falls back to templated lines when no API key
 * is configured, so a render never blocks on it.
 */
export async function writeScript(data, rounds) {
  const anthropic = client();
  if (!anthropic) {
    console.warn('    [script] ANTHROPIC_API_KEY not set — using templated lines');
    return { ...templateScript(data, rounds), source: 'template' };
  }

  const statLines = rounds
    .map((r, i) => {
      const who = r.winner === 'a' ? data.entityA : r.winner === 'b' ? data.entityB : 'neither';
      return `${i + 1}. ${r.label}: ${data.entityA} = ${r.valueA}, ${data.entityB} = ${r.valueB} (edge: ${who})`;
    })
    .join('\n');

  const scoreA = rounds.filter((r) => r.winner === 'a').length;
  const scoreB = rounds.filter((r) => r.winner === 'b').length;

  const prompt = `Write the narration for a comparison video: ${data.entityA} vs ${data.entityB}${
    data.category ? ` (category: ${data.category})` : ''
  }.

These are the ONLY statistics you may cite:
${statLines}

Running score from those stats: ${data.entityA} ${scoreA}, ${data.entityB} ${scoreB}.

Reference material from the page (for context and framing only, do not quote it):
${data.shortAnswer || '(none)'}
${data.verdict || ''}

Write:
- hook: max ${BUDGET.hook} words.
- tape: max ${BUDGET.tape} words.
- rounds: exactly ${rounds.length} lines, max ${BUDGET.round} words each, in the same order as the stats above. Line i is spoken while stat i is on screen, so it must be about that stat.
- verdict: max ${BUDGET.verdict} words. The score says ${
    scoreA === scoreB ? 'it is tied' : `${scoreA > scoreB ? data.entityA : data.entityB} wins on points`
  } — be honest about that, then say who should pick the other one.
- youtubeTitle and youtubeDescription for the upload.`;

  try {
    const res = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4000,
      system: SYSTEM,
      thinking: { type: 'adaptive' },
      output_config: {
        effort: 'medium',
        format: { type: 'json_schema', schema: SCRIPT_SCHEMA },
      },
      messages: [{ role: 'user', content: prompt }],
    });

    const text = res.content.find((b) => b.type === 'text')?.text;
    if (!text) throw new Error('no text block in response');
    const parsed = JSON.parse(text);

    // The model is asked for exactly N round lines; top up from the template
    // rather than leaving a silent gap if it returns fewer.
    const fallback = templateScript(data, rounds);
    const roundsOut = rounds.map(
      (_, i) => sanitise(parsed.rounds?.[i]) || fallback.rounds[i]
    );

    return {
      hook: sanitise(parsed.hook) || fallback.hook,
      tape: sanitise(parsed.tape) || fallback.tape,
      rounds: roundsOut,
      verdict: sanitise(parsed.verdict) || fallback.verdict,
      youtubeTitle: sanitise(parsed.youtubeTitle) || `${data.entityA} vs ${data.entityB}`,
      youtubeDescription: sanitise(parsed.youtubeDescription) || data.shortAnswer || '',
      source: 'claude',
    };
  } catch (err) {
    console.warn(`    [script] Claude scriptwriting failed (${err.message}) — using templated lines`);
    return { ...templateScript(data, rounds), source: 'template-fallback' };
  }
}

/** Normalise smart punctuation the TTS and the caption band both dislike. */
function sanitise(s) {
  if (typeof s !== 'string') return null;
  const out = s
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
  return out.length ? out : null;
}

/** Deterministic fallback so the pipeline runs with no API key at all. */
export function templateScript(data, rounds) {
  const a = data.entityA;
  const b = data.entityB;
  const scoreA = rounds.filter((r) => r.winner === 'a').length;
  const scoreB = rounds.filter((r) => r.winner === 'b').length;
  const leader = scoreA === scoreB ? null : scoreA > scoreB ? a : b;

  return {
    hook: `${a} or ${b}? The numbers settle it.`,
    tape: `Five categories. One winner. Here is how they actually compare.`,
    rounds: rounds.map((r) => {
      const label = String(r.label || '').toLowerCase();
      if (r.winner === 'a') return `${a} takes ${label}.`;
      if (r.winner === 'b') return `${b} takes ${label}.`;
      return `On ${label}, it is dead even.`;
    }),
    verdict: leader
      ? `${leader} wins it ${Math.max(scoreA, scoreB)} to ${Math.min(scoreA, scoreB)}.`
      : `It ends level. Your call.`,
    youtubeTitle: `${a} vs ${b}: Full Comparison`,
    youtubeDescription: data.shortAnswer || `${a} vs ${b} compared across ${rounds.length} categories.`,
  };
}

/**
 * Write a photographic scene description for an entity that has no usable
 * photograph, for Higgsfield Soul to render.
 *
 * Two failures drove this. Soul has no negative-prompt parameter, so a
 * "Negative: no collage, no grid, no borders" tail is read as a *positive*
 * instruction and returns a moodboard with a colour-palette strip. And an
 * abstract framing ("a photograph representing Japan") invites a conceptual
 * montage rather than a picture. The fix for both is the same: hand Soul one
 * concrete scene that a real photographer could have shot, and nothing else.
 */
export async function writeImagePrompt(entity, category = '') {
  const fallback = `Wide cinematic night photograph of ${entity}, single continuous frame, dramatic low-key lighting, deep shadows, cool colour grade, volumetric haze, shot on 85mm, vertical composition with clean empty space in the lower third.`;

  const anthropic = client();
  if (!anthropic) return fallback;

  try {
    const res = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 700,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'low' },
      system: `You write prompts for a text-to-image model that has no negative-prompt support.

Rules:
- Describe ONE concrete scene a real photographer could have shot. Not a concept, not a montage.
- Name a specific place, object or moment. For a country, pick its single most recognisable skyline or landmark and name it. For an abstract idea, pick one physical scene that embodies it.
- Never use the words collage, grid, panel, border, split, diptych, montage, moodboard, or the word "no" - this model reads every word as something to draw.
- Never ask for text, captions, labels or logos.
- Vertical 9:16 framing, subject in the upper two thirds, lower third clean and dark so captions can sit there.
- Cinematic, low-key, deep shadows, cool grade. One sentence to three. Output the prompt only.`,
      messages: [
        {
          role: 'user',
          content: `Entity: ${entity}${category ? `\nCategory: ${category}` : ''}`,
        },
      ],
    });
    const text = res.content.find((b) => b.type === 'text')?.text?.trim();
    return text && text.length > 30 ? text.replace(/\s+/g, ' ') : fallback;
  } catch (err) {
    console.warn(`    [imagery] scene prompt failed for "${entity}": ${err.message}`);
    return fallback;
  }
}
