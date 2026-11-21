import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-482 — DAP vs portable DAC/amp.
 * Opened 21 November 2026 (Asia/Jerusalem):
 * FiiO KA11 specifications (Chinese product specifications);
 * FiiO Q7 description;
 * FiiO Q7 parameters;
 * Sony NW-ZX707 listing;
 * Sony Walkman microSD capacity article;
 * Son-Vidéo, "Portable USB DAC or DAP", updated 18 February 2026;
 * HifiGuides forum thread, 15 April 2020 (opinion only).
 * dataPointCount stays 0. No winner. No prices. No milliwatt figure
 * without the load and output the maker wrote next to it.
 * The English KA11 release note does not carry the milliwatt table.
 * Audiophiles.co price bands and category milliwatt ranges are not used.
 * No Reddit link and no Reddit comment text.
 */

const PUBLISHED = "2026-11-21T00:00:00Z";
const SOURCE_DATE = "2026-11-21";

const DAC = "portable-dac-amp";
const DAP = "dap";

const KA11 = "https://cn.fiio.com/product_details/ka11.html";
const Q7 = "https://www.fiio.com/q7";
const Q7_PARAMS = "https://www.fiio.com/Q7_parameters";
const SONY_ZX707 =
  "https://electronics.sony.com/audio/walkman-digital-recorders/all-walkman-digital-recorders/p/nwzx707-b";
const SONY_SD = "https://www.sony.com/electronics/support/articles/00200481";
const SON_VIDEO =
  "https://blog.son-video.com/en/2021/10/portable-usb-dac-or-dap-which-to-choose/";
const HIFIGUIDES = "https://forum.hifiguides.com/t/external-portable-dac-amp-vs-dap/10712";

const SHORT_ANSWER = `Choose a portable DAC/amp when your phone or computer stays the player and you want a separate USB converter and headphone amplifier. Choose a DAP when you want a separate player with its own storage and battery, so listening does not use the phone as the source.`;

const CHOOSE_TABLE = [
  "Match a situation below. This is not a ranking. A named model is an example from that maker, not the whole category.",
  "| Situation | Choose a portable DAC/amp if | Choose a DAP if |",
  "| --- | --- | --- |",
  "| Streaming apps | The apps stay on the phone, and the DAC/amp takes USB audio from that phone | You want Wi-Fi streaming on a separate player, as Sony describes for the NW-ZX707 |",
  "| Local files | The files stay on the phone or the computer | You want the player's own memory, such as the NW-ZX707's 64 GB plus a microSD slot |",
  "| Battery | You accept a dongle whose spec list has no battery line, or you pick a brick with its own battery | You want the player's battery. Sony rates the NW-ZX707 at up to 25 hours of 44.1 kHz FLAC and says actual time varies |",
  "| Headphone load | You compare the maker's milliwatts at your headphone's impedance and on the output you will use | You compare that player's own output spec at the same impedance. An NW-ZX707 milliwatt rating is not in these documents |",
  "| Computer | The DAC/amp also connects to a computer, as FiiO states for the KA11 and the Q7 | A separate player is still what you want. Computer playback is not what the NW-ZX707 listing describes |",
].join("\n");

const POWER_TABLE = [
  "FiiO's stated headphone output for two products, not for every DAC/amp and not for a DAP. KA11 cells are the minimum on the left and the minimum on the right, 3.5 mm, THD+N under 1 percent. Q7 cells are the balanced 2.5 mm and 4.4 mm Ultra High gain row, THD+N under 1 percent. FiiO's gain line names Ultra High as DC mode.",
  "| Load | FiiO KA11, 3.5 mm | FiiO Q7, balanced, Ultra High |",
  "| --- | --- | --- |",
  "| 16 ohms | At least 245 mW left and 245 mW right | 1500 mW |",
  "| 32 ohms | At least 200 mW left and 200 mW right | 3000 mW |",
  "| 300 ohms | At least 22 mW left and 22 mW right | 500 mW |",
].join("\n");

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways.

- A portable DAC/amp converts and amplifies audio from another player. FiiO's KA11 is a USB headphone adapter for a phone, tablet, or computer. FiiO's Q7 is a portable DAC and amplifier that also connects to a computer.
- A DAP is a player. Sony's NW-ZX707 is a Walkman digital media player with 64 GB of built-in memory, a microSD slot, Wi-Fi streaming, and its own battery.
- A dongle and a battery brick are both portable DAC/amps. The KA11 specification list has no battery-capacity line. The Q7 parameters list a 9200 mAh battery and a DC supply.
- Output power belongs to one load and one output. At 300 ohms, the KA11 lists at least 22 mW on the left and 22 mW on the right. The Q7 balanced Ultra High row lists 500 mW. Both state THD+N under 1 percent.
- Choose the DAC/amp when the phone or computer stays the player. Choose the DAP when the player, the storage, and the battery should be a separate device.
- A street price is not in these documents. Compare the current listing of the two devices in front of you.

## What each one is

Choose a portable DAC/amp when something else plays the file and this device converts and amplifies it. Choose a DAP when the device itself is the player.

Son-Vidéo, updated 18 February 2026, writes that a portable DAC is used with a smartphone on the go. The phone is the player, from files in its memory or from an online service, and it sends digital audio to the DAC, which converts that audio to analog. The same piece says a digital audio player, a DAP, can play files stored in its memory or on an SD card, and that some players also reach streaming services once they are on Wi-Fi.

FiiO's KA11 specifications describe a USB headphone audio adapter that connects to a phone, a tablet, or a computer, with a Type-C or Lightning input and a 3.5 mm headphone output. FiiO's Q7 description calls that unit a portable DAC and amplifier: a short USB cable to a phone, a computer connection with a DC supply for desk listening, and Bluetooth to phones, tablets, and music players. Sony's NW-ZX707 listing calls that unit a Walkman digital media player. It stores music, plays it, and offers Wi-Fi for download and streaming. Those three products are examples. They are not a ranking.

## Dongle, battery brick, and the phone

Choose a dongle when you want the smallest USB adapter and you accept that its spec list may not include a battery. Choose a battery brick when the amplifier should have its own battery. Choose a DAP when listening should run on the player's battery.

FiiO's KA11 specification list names weight of about 8.5 g, a Type-C or Lightning input, and a 3.5 mm output. It has no battery-capacity line. FiiO's Q7 parameters list a weight of about 620 g, a 9200 mAh lithium-polymer battery, power from USB Power Delivery at 9 V or from DC at 12 V and 2 A, and a charge time of about 4.5 hours. FiiO's Q7 description says the unit can run from that battery or from the DC supply, and that in the DC case the battery is bypassed.

On the Q7 parameters, one 3.5 mm battery-life row is at least 11 hours when the input is USB, optical, or coaxial, gain is Super High, volume is 35, the track is MP3 at 44.1 kHz and 16 bit, the screen is off, charging is off, and the load is 32 ohms. The matching 4.4 mm row, at volume 29 and the same track, screen, charge, and 32 ohm load, is at least 9 hours. A different gain, volume, codec, or load is a different test.

Sony rates the NW-ZX707 at up to 25 hours of 44.1 kHz FLAC playback. Sony's footnote says actual time varies with settings, conditions, storage, and use, and that battery capacity falls as the battery ages. Son-Vidéo writes that a DAP does not draw on the phone's battery, unlike DAC units that do not always have a battery of their own. The KA11 and the Q7 are the two cases behind that sentence: one spec list has no battery line, and the other names a 9200 mAh battery.

## Where the music is stored

Choose a portable DAC/amp when the library or the streaming apps stay on the phone or the computer. Choose a DAP when you want storage and playback on the player.

Sony's NW-ZX707 listing gives 64 GB of built-in flash memory plus a microSD, microSDHC, and microSDXC slot. Sony's storage article includes the NW-ZX700 series, the series name in the NW-ZX707 model number, and says those models support microSD cards up to 128 GB and microSDXC cards up to 1 TB. Sony says it cannot guarantee full compatibility with cards from other brands. The same listing says the player supports MP3, FLAC, Apple Lossless, AAC, WAV, AIFF, DSD, and MQA, with PCM up to 32-bit/384 kHz and native DSD up to 11.2 MHz.

Sony also says the NW-ZX707 is Wi-Fi compatible for direct download and streaming, runs Android, and can download apps from Google Play. Network services can require fees and registration, and Sony says those services can change or stop. A phone plus a DAC/amp keeps the phone's apps. A DAP such as this Walkman can run streaming apps on its own, which matters when you want the phone out of the listening chain. Son-Vidéo makes the same split: some players only play stored files, and others reach streaming services on Wi-Fi.

## Output power at one impedance

Choose by the maker's output power at your headphone's impedance, on the jack you will use. A milliwatt figure with no ohm load is not the same claim.

${POWER_TABLE}

FiiO's KA11 cells in that table are minimums, written as left plus right. At 32 ohms that is at least 200 mW and 200 mW. At 300 ohms it is at least 22 mW and 22 mW. The supported digital formats on that spec list are 384 kHz/32-bit and DSD256. FiiO's Q7 balanced Ultra High row is 1500 mW at 16 ohms, 3000 mW at 32 ohms, and 500 mW at 300 ohms. The single-ended 3.5 mm and 6.35 mm Ultra High row is a different output: 1500 mW at 16 ohms, 1100 mW at 32 ohms, and 130 mW at 300 ohms, again with THD+N under 1 percent. FiiO's recommended headphone impedance on the Q7 is 16 to 150 ohms for the single-ended outputs and 16 to 300 ohms for the balanced outputs.

The Q7 description also says battery-powered mode can reach up to 1500 mW and that DC mode, in Enhanced over-ear headphone mode, can reach up to 3000 mW. Those two sentences do not name an ohm load. The loaded figures are the parameters rows in the table, and Ultra High is the gain line FiiO marks as DC mode. Do not treat 3000 mW as the 300 ohm cell. At 300 ohms the balanced Ultra High cell is 500 mW.

These documents do not include a listening test of a planar headphone, and they do not include a milliwatt rating for the NW-ZX707. Sony's listing does name two headphone jacks on that player: a 4.4 mm balanced jack and a 3.5 mm stereo mini-jack. A sensitive in-ear monitor and a high-impedance full-size headphone are different loads. Read the ohm cell that matches the headphone, then read the same cell on the other device.

## Which habit to choose

${CHOOSE_TABLE}

Choose a portable DAC/amp for streaming on the phone, for a library that already lives on that phone or on a computer, and when one unit should also work at a desk. FiiO says the KA11 connects to Android or iOS phones and tablets, or to Windows or Mac computers. FiiO's Q7 description includes a desk connection to a computer with the DC supply, plus USB, optical, and coaxial inputs.

Choose a DAP for a large local library on the player's own card, for offline files, or when you want the phone left alone. Sony's NW-ZX700 series card limits, the 64 GB inside the NW-ZX707, and that player's own battery are the storage and battery facts in these documents. They are this Walkman's figures, not a figure for every DAP.

## A forum opinion, and what it is not

On 15 April 2020, in a HifiGuides thread, one reply said a DAC/amp strapped to a phone is the setup they would pick if the buyer does not mind that strap, because a DAP is a separate device. Another reply said a DAP is easier to manage while walking, and that a DAC/amp tethered to a phone is more cumbersome in a pocket, with a cable that can disconnect. That is community opinion from that thread. It is not a measurement, and it is not a power or price figure.

## Price, and what these documents leave open

A price is not in these documents. Compare the current listing of each device. Nothing here says what a budget includes.

A given headphone's sensitivity, a listening-test result, and a milliwatt rating for the NW-ZX707 are not in these documents either. The safe comparison is the maker's output power at your headphone's impedance, on the jack you will actually use.`;

const FAQS = [
  {
    question: "Should I buy a DAP or a portable DAC/amp?",
    answer:
      "Choose a portable DAC/amp when a phone or computer stays the player and you add a USB converter and headphone amplifier. Choose a DAP when you want a separate player with its own storage and battery, such as Sony's NW-ZX707 Walkman, so listening does not depend on the phone. Neither sentence is a ranked result.",
  },
  {
    question: "Do I need a DAP if I only stream music?",
    answer:
      "Choose a portable DAC/amp if the streaming apps stay on the phone. Son-Vidéo, updated 18 February 2026, writes that the phone can be the player and send digital audio to a portable DAC. Choose a DAP if you want those apps on the player. Sony's NW-ZX707 listing says it is Wi-Fi compatible for direct download and streaming, runs Android, and can download apps from Google Play. Fees and registration can apply.",
  },
  {
    question: "Can a dongle DAC drive planar or high-impedance headphones?",
    answer:
      "Compare the maker's output power at your headphone's impedance, on the jack you will use. FiiO's KA11 specifications list at least 200 mW on the left and 200 mW on the right at 32 ohms, and at least 22 mW and 22 mW at 300 ohms, both with THD+N under 1 percent, on the 3.5 mm output. FiiO's Q7 parameters list 3000 mW at 32 ohms and 500 mW at 300 ohms on the balanced output at Ultra High gain, which that gain line calls DC mode, also with THD+N under 1 percent. Those are two FiiO products. They are not a result for every dongle or every planar.",
  },
  {
    question: "Can I use a portable DAC/amp with a computer?",
    answer:
      "FiiO's KA11 specifications say the adapter connects to Android or iOS phones and tablets, or to Windows or Mac computers. FiiO's Q7 description says a desk setup connects the unit to a computer with the DC supply. A given computer's USB port still has its own connection notes.",
  },
  {
    question: "Does a portable DAC/amp always have its own battery?",
    answer:
      "No. FiiO's KA11 specification list names a USB Type-C or Lightning input and includes no battery-capacity line. FiiO's Q7 parameters list a 9200 mAh battery, and the Q7 description says it can run from that battery or from a DC supply. Son-Vidéo, updated 18 February 2026, writes that a DAP does not use the phone's battery, unlike DACs which do not always have their own battery.",
  },
  {
    question: "How do I compare output power without mixing loads?",
    answer:
      "Read the ohms next to the milliwatts, and read the jack. On the KA11, 32 ohms and 300 ohms are different cells: at least 200 mW per channel at 32 ohms, and at least 22 mW per channel at 300 ohms. On the Q7 balanced Ultra High row, 32 ohms is 3000 mW and 300 ohms is 500 mW. The Q7 description's lines of up to 1500 mW and up to 3000 mW do not name an ohm load, so they are not a substitute for those cells. An NW-ZX707 milliwatt rating is not in these documents.",
  },
];

const VERDICT = `Choose a portable DAC/amp when the phone or computer stays the player. Choose a DAP when you want a separate player with its own storage and battery.

Compare output power at your headphone's impedance. FiiO's KA11 lists at least 22 mW on each channel at 300 ohms. FiiO's Q7 balanced Ultra High row lists 500 mW at 300 ohms. Both state THD+N under 1 percent. A price is not in these documents.`;

const BUILT = buildEditorialComparison({
  slug: "dap-vs-portable-dac-amp",
  title: "DAP vs Portable DAC/Amp?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: DAC,
      slug: DAC,
      name: "Portable DAC/amp",
      shortDesc:
        "A USB converter and headphone amplifier for a phone, tablet, or computer. A dongle may have no battery of its own. A brick may.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [],
      cons: [],
      bestFor: "Choose this when the phone or computer stays the player",
    },
    {
      id: DAP,
      slug: DAP,
      name: "DAP",
      shortDesc:
        "A digital audio player with its own storage and battery. Sony's NW-ZX707 is one Walkman example, not every DAP.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [],
      cons: [],
      bestFor: "Choose this when you want a separate player, storage, and battery",
    },
  ],
  keyDifferences: [
    {
      label: "What it is",
      entityAValue: "Converts and amplifies audio from another player",
      entityBValue: "A player that stores and plays the music",
      winner: "tie",
    },
    {
      label: "Who plays the file",
      entityAValue: "The phone or computer, in Son-Vidéo's 18 February 2026 description and in FiiO's KA11 and Q7 connections",
      entityBValue: "The player. Sony's NW-ZX707 is a Walkman digital media player",
      winner: "tie",
    },
    {
      label: "Battery example",
      entityAValue: "KA11 spec list has no battery line. Q7 parameters list 9200 mAh, or DC at 12 V and 2 A",
      entityBValue: "NW-ZX707: up to 25 hours of 44.1 kHz FLAC. Sony says actual time varies",
      winner: "tie",
    },
    {
      label: "Storage example",
      entityAValue: "Files stay on the phone or computer. The DAC/amp examples here do not add a microSD slot",
      entityBValue: "NW-ZX707: 64 GB built in, plus a microSD slot. NW-ZX700 series: microSD up to 128 GB, microSDXC up to 1 TB",
      winner: "tie",
    },
    {
      label: "300 ohm output example",
      entityAValue: "KA11: at least 22 mW left and 22 mW right at 300 ohms, 3.5 mm, THD+N under 1 percent",
      entityBValue: "An NW-ZX707 milliwatt rating is not in these documents. Q7 balanced Ultra High, a DAC/amp, lists 500 mW at 300 ohms",
      winner: "tie",
    },
    {
      label: "Computer",
      entityAValue: "KA11: Windows or Mac. Q7: computer with the DC supply, plus USB, optical, and coaxial",
      entityBValue: "Computer playback is not what the NW-ZX707 listing describes",
      winner: "tie",
    },
    {
      label: "Streaming",
      entityAValue: "Apps stay on the phone. The DAC receives the digital audio",
      entityBValue: "NW-ZX707: Wi-Fi download and streaming, Android, Google Play. Fees can apply",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "role",
      "Role",
      "What it is",
      DAC,
      DAP,
      "USB converter and headphone amplifier for another player",
      "Digital audio player with its own storage and battery",
    ),
    textAttr(
      "example",
      "Maker example",
      "What it is",
      DAC,
      DAP,
      "FiiO KA11 dongle and FiiO Q7 battery DAC/amp",
      "Sony NW-ZX707 Walkman digital media player",
    ),
    textAttr(
      "power-source",
      "Power source",
      "Battery",
      DAC,
      DAP,
      "KA11: no battery-capacity line. Q7: 9200 mAh battery, or DC 12 V / 2 A",
      "NW-ZX707 battery, rated up to 25 hours of 44.1 kHz FLAC, with actual time varying",
    ),
    textAttr(
      "storage",
      "Where files live",
      "Storage",
      DAC,
      DAP,
      "On the phone or computer that is playing them",
      "64 GB built in on the NW-ZX707, plus a microSD slot. NW-ZX700 series: up to 1 TB microSDXC",
    ),
    textAttr(
      "mw-32",
      "Output at 32 ohms",
      "Power",
      DAC,
      DAP,
      "KA11: at least 200 mW left and 200 mW right, 3.5 mm. Q7 balanced Ultra High: 3000 mW. Both THD+N under 1 percent",
      "An NW-ZX707 milliwatt rating is not in these documents",
    ),
    textAttr(
      "mw-300",
      "Output at 300 ohms",
      "Power",
      DAC,
      DAP,
      "KA11: at least 22 mW left and 22 mW right, 3.5 mm. Q7 balanced Ultra High: 500 mW. Both THD+N under 1 percent",
      "An NW-ZX707 milliwatt rating is not in these documents",
    ),
    textAttr(
      "computer",
      "Computer connection",
      "Desk",
      DAC,
      DAP,
      "KA11 connects to Windows or Mac. Q7 connects to a computer with the DC supply",
      "Computer playback is not what the NW-ZX707 listing describes",
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: null,
    keyFact:
      "FiiO's KA11 lists at least 22 mW on each channel at 300 ohms. FiiO's Q7 balanced Ultra High row lists 500 mW at 300 ohms. Both state THD+N under 1 percent.",
  },
  citationStats: {
    sourceCount: 7,
    dataPointCount: 0,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "FiiO KA11 specifications", url: KA11 },
      { name: "FiiO Q7 portable DAC and amplifier", url: Q7 },
      { name: "FiiO Q7 parameters", url: Q7_PARAMS },
      { name: "Sony NW-ZX707 Walkman", url: SONY_ZX707 },
      { name: "Sony Walkman microSD capacity", url: SONY_SD },
      { name: "Son-Vidéo: Portable USB DAC or DAP (updated 18 February 2026)", url: SON_VIDEO },
      { name: "HifiGuides: external DAC/amp vs DAP (15 April 2020, opinion)", url: HIFIGUIDES },
    ],
  },
  resources: [
    {
      type: "external",
      label: "FiiO KA11 specifications",
      url: KA11,
      description:
        "FiiO KA11 specifications. USB headphone audio adapter for a phone, tablet, or computer. Type-C or Lightning input, 3.5 mm output, about 8.5 g. At least 245 mW per channel at 16 ohms, 200 mW per channel at 32 ohms, and 22 mW per channel at 300 ohms, each with THD+N under 1 percent. 384 kHz/32-bit and DSD256. No battery-capacity line.",
    },
    {
      type: "external",
      label: "FiiO Q7 portable DAC and amplifier",
      url: Q7,
      description:
        "FiiO Q7 description. Portable DAC and amplifier. Phone by a short USB cable, computer with a DC supply, Bluetooth to phones, tablets, and music players. Battery mode or DC mode, with the battery bypassed on DC. The unloaded lines say up to 1500 mW on battery and up to 3000 mW in Enhanced over-ear headphone mode on DC.",
    },
    {
      type: "external",
      label: "FiiO Q7 parameters",
      url: Q7_PARAMS,
      description:
        "FiiO Q7 parameters. 9200 mAh battery. DC 12 V / 2 A. Ultra High gain is marked DC mode. Balanced Ultra High: 1500 mW at 16 ohms, 3000 mW at 32 ohms, 500 mW at 300 ohms, THD+N under 1 percent. Single-ended Ultra High at 32 ohms is 1100 mW and at 300 ohms is 130 mW. Battery-life rows name their own gain, volume, track, and 32 ohm load.",
    },
    {
      type: "external",
      label: "Sony NW-ZX707 Walkman",
      url: SONY_ZX707,
      description:
        "Sony NW-ZX707 listing. Walkman digital media player. 64 GB built-in flash plus a microSD slot. Wi-Fi download and streaming. Android and Google Play. Up to 25 hours of 44.1 kHz FLAC, with actual time varying. 4.4 mm balanced jack and 3.5 mm jack. PCM up to 32-bit/384 kHz and native DSD up to 11.2 MHz. No milliwatt rating in this listing.",
    },
    {
      type: "external",
      label: "Sony Walkman microSD capacity",
      url: SONY_SD,
      description:
        "Sony storage article. The NW-ZX700 series is among the listed models. microSD cards up to 128 GB and microSDXC cards up to 1 TB. Sony cannot guarantee full compatibility with cards from other brands.",
    },
    {
      type: "external",
      label: "Son-Vidéo: Portable USB DAC or DAP (updated 18 February 2026)",
      url: SON_VIDEO,
      description:
        "Son-Vidéo, updated 18 February 2026. The phone can be the player and send digital audio to a portable DAC. A DAP can play files in its memory or on an SD card, and some reach streaming services on Wi-Fi. A DAP works on its own and does not use the phone's battery, unlike DACs which do not always have their own battery.",
    },
    {
      type: "external",
      label: "HifiGuides: external DAC/amp vs DAP (15 April 2020, opinion)",
      url: HIFIGUIDES,
      description:
        "HifiGuides, 15 April 2020. Community opinion only. One reply preferred a DAC/amp strapped to a phone if the buyer does not mind that strap. Another said a DAP is easier while walking and that a tethered DAC/amp is more cumbersome, with a cable that can disconnect. Not a measurement.",
    },
  ],
  metaTitle: "DAP vs Portable DAC/Amp?",
});

BUILT.metadata.metaDescription =
  "Choose a portable DAC/amp when the phone or computer stays the player. Choose a DAP for a separate player with its own storage and battery.";

export const DAP_VS_PORTABLE_DAC_AMP: EditorialComparison = BUILT;
