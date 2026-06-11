// Q1 2026 AI Tool Battles Index — ranked slate.
// Source: DataForSEO Labs (location_code 2840 = United States, language en, exact-match),
// pulled 2026-06-12. Confirmed dataset on DAN-423 (dan423_top50_2026-06-12.csv).
// Every figure here is US Google Search volume. There is no worldwide aggregate.

export type Battle = {
  rank: number;
  battle: string;
  q1: number; // Q1 2026 (Jan–Mar 2026)
  q4: number; // Q4 2025 (Oct–Dec 2025)
  q1Prev: number; // Q1 2025 (Jan–Mar 2025)
  qoq: number; // % change vs Q4 2025
  yoy: number; // % change vs Q1 2025
};

export const BATTLES: Battle[] = [
  { rank: 1, battle: 'claude code vs cursor', q1: 39000, q4: 15200, q1Prev: 2620, qoq: 156.6, yoy: 1388.5 },
  { rank: 2, battle: 'chatgpt vs claude', q1: 38700, q4: 8900, q1Prev: 7700, qoq: 334.8, yoy: 402.6 },
  { rank: 3, battle: 'chatgpt vs gemini', q1: 30100, q4: 32800, q1Prev: 13200, qoq: -8.2, yoy: 128.0 },
  { rank: 4, battle: 'claude vs gemini', q1: 23800, q4: 5300, q1Prev: 1550, qoq: 349.1, yoy: 1435.5 },
  { rank: 5, battle: 'iphone vs samsung', q1: 10100, q4: 10800, q1Prev: 12400, qoq: -6.5, yoy: -18.5 },
  { rank: 6, battle: 'chrome vs firefox', q1: 8700, q4: 9400, q1Prev: 9400, qoq: -7.4, yoy: -7.4 },
  { rank: 7, battle: 'chatgpt vs copilot', q1: 8200, q4: 10100, q1Prev: 7700, qoq: -18.8, yoy: 6.5 },
  { rank: 8, battle: 'chrome vs safari', q1: 8200, q4: 8200, q1Prev: 22800, qoq: 0.0, yoy: -64.0 },
  { rank: 9, battle: 'chrome vs edge', q1: 7700, q4: 7200, q1Prev: 10200, qoq: 6.9, yoy: -24.5 },
  { rank: 10, battle: 'notion vs obsidian', q1: 7700, q4: 5400, q1Prev: 6700, qoq: 42.6, yoy: 14.9 },
  { rank: 11, battle: 'slack vs teams', q1: 6200, q4: 5100, q1Prev: 7200, qoq: 21.6, yoy: -13.9 },
  { rank: 12, battle: 'claude vs perplexity', q1: 5680, q4: 1900, q1Prev: 1260, qoq: 198.9, yoy: 350.8 },
  { rank: 13, battle: 'iphone 15 vs iphone 16', q1: 4400, q4: 4800, q1Prev: 10100, qoq: -8.3, yoy: -56.4 },
  { rank: 14, battle: '1password vs bitwarden', q1: 4200, q4: 3000, q1Prev: 3600, qoq: 40.0, yoy: 16.7 },
  { rank: 15, battle: 'chatgpt vs perplexity', q1: 3900, q4: 5600, q1Prev: 1000, qoq: -30.4, yoy: 290.0 },
  { rank: 16, battle: 'cursor vs windsurf', q1: 3900, q4: 4500, q1Prev: 9900, qoq: -13.3, yoy: -60.6 },
  { rank: 17, battle: 'cursor vs copilot', q1: 3600, q4: 4800, q1Prev: 12700, qoq: -25.0, yoy: -71.7 },
  { rank: 18, battle: 'slack vs discord', q1: 3360, q4: 1900, q1Prev: 3000, qoq: 76.8, yoy: 12.0 },
  { rank: 19, battle: 'brave vs chrome', q1: 3000, q4: 2640, q1Prev: 3180, qoq: 13.6, yoy: -5.7 },
  { rank: 20, battle: 'pixel vs iphone', q1: 2760, q4: 4500, q1Prev: 3900, qoq: -38.7, yoy: -29.2 },
  { rank: 21, battle: 'firefox vs safari', q1: 2320, q4: 2320, q1Prev: 3300, qoq: 0.0, yoy: -29.7 },
  { rank: 22, battle: 'zoom vs google meet', q1: 2320, q4: 1660, q1Prev: 2640, qoq: 39.8, yoy: -12.1 },
  { rank: 23, battle: '1password vs lastpass', q1: 2160, q4: 2190, q1Prev: 2880, qoq: -1.4, yoy: -25.0 },
  { rank: 24, battle: 'onedrive vs google drive', q1: 2160, q4: 2190, q1Prev: 3060, qoq: -1.4, yoy: -29.4 },
  { rank: 25, battle: 'proton pass vs bitwarden', q1: 2160, q4: 2030, q1Prev: 1770, qoq: 6.4, yoy: 22.0 },
  { rank: 26, battle: 'icloud vs google drive', q1: 1900, q4: 2030, q1Prev: 2760, qoq: -6.4, yoy: -31.2 },
  { rank: 27, battle: 'nordpass vs 1password', q1: 1900, q4: 2160, q1Prev: 2320, qoq: -12.0, yoy: -18.1 },
  { rank: 28, battle: 'google drive vs dropbox', q1: 1770, q4: 1770, q1Prev: 2640, qoq: 0.0, yoy: -33.0 },
  { rank: 29, battle: 'zoom vs teams', q1: 1770, q4: 1570, q1Prev: 2640, qoq: 12.7, yoy: -33.0 },
  { rank: 30, battle: 'bitwarden vs lastpass', q1: 1550, q4: 1550, q1Prev: 2310, qoq: 0.0, yoy: -32.9 },
  { rank: 31, battle: 'dropbox vs onedrive', q1: 1260, q4: 1260, q1Prev: 1900, qoq: 0.0, yoy: -33.7 },
  { rank: 32, battle: 'gemini vs perplexity', q1: 1170, q4: 1040, q1Prev: 510, qoq: 12.5, yoy: 129.4 },
  { rank: 33, battle: 'dashlane vs 1password', q1: 1170, q4: 1700, q1Prev: 1550, qoq: -31.2, yoy: -24.5 },
  { rank: 34, battle: 'notion vs evernote', q1: 1170, q4: 1100, q1Prev: 1950, qoq: 6.4, yoy: -40.0 },
  { rank: 35, battle: 'airpods vs galaxy buds', q1: 550, q4: 630, q1Prev: 550, qoq: -12.7, yoy: 0.0 },
  { rank: 36, battle: 'perplexity vs google', q1: 490, q4: 640, q1Prev: 1120, qoq: -23.4, yoy: -56.2 },
  { rank: 37, battle: 'bear vs obsidian', q1: 450, q4: 450, q1Prev: 640, qoq: 0.0, yoy: -29.7 },
  { rank: 38, battle: 'cursor vs cline', q1: 420, q4: 640, q1Prev: 2110, qoq: -34.4, yoy: -80.1 },
  { rank: 39, battle: 'midjourney vs stable diffusion', q1: 370, q4: 450, q1Prev: 1460, qoq: -17.8, yoy: -74.7 },
  { rank: 40, battle: 'arc vs chrome', q1: 310, q4: 370, q1Prev: 780, qoq: -16.2, yoy: -60.3 },
  { rank: 41, battle: 'apple notes vs notion', q1: 160, q4: 140, q1Prev: 190, qoq: 14.3, yoy: -15.8 },
  { rank: 42, battle: 'bard vs chatgpt', q1: 140, q4: 110, q1Prev: 560, qoq: 27.3, yoy: -75.0 },
  { rank: 43, battle: 'midjourney vs dall-e', q1: 110, q4: 120, q1Prev: 750, qoq: -8.3, yoy: -85.3 },
  { rank: 44, battle: 'ideogram vs midjourney', q1: 80, q4: 150, q1Prev: 490, qoq: -46.7, yoy: -83.7 },
  { rank: 45, battle: 'dall-e vs stable diffusion', q1: 70, q4: 80, q1Prev: 230, qoq: -12.5, yoy: -69.6 },
  { rank: 46, battle: 'midjourney vs flux', q1: 70, q4: 50, q1Prev: 420, qoq: 40.0, yoy: -83.3 },
  { rank: 47, battle: 'obsidian vs roam', q1: 60, q4: 40, q1Prev: 150, qoq: 50.0, yoy: -60.0 },
  { rank: 48, battle: 'chatgpt search vs perplexity', q1: 30, q4: 30, q1Prev: 190, qoq: 0.0, yoy: -84.2 },
  { rank: 49, battle: 'copilot vs codeium', q1: 30, q4: 30, q1Prev: 90, qoq: 0.0, yoy: -66.7 },
  { rank: 50, battle: 'copilot vs tabnine', q1: 30, q4: 40, q1Prev: 140, qoq: -25.0, yoy: -78.6 },
  { rank: 51, battle: 'perplexity vs you.com', q1: 30, q4: 30, q1Prev: 60, qoq: 0.0, yoy: -50.0 },
];

// Headline figure cited in the Q1 2026 press release. Verified to equal the
// sum of q1 across BATTLES (251,380). US Google Search, exact-match.
export const HEADLINE_TOTAL = 251380;
export const BATTLE_COUNT = 50;
