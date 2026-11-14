import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-435 — MSI MAG B850 Tomahawk Max WiFi vs ASUS TUF Gaming B850-Plus WiFi.
 * Opened 14 November 2026 (Asia/Jerusalem):
 * MSI specification, MSI overview, MSI English manual PDF,
 * ASUS product page, ASUS tech spec, ASUS user manual PDF,
 * AMD Ryzen 7 9800X3D specifications.
 *
 * The brief's "14+2+1, 80A on both" line does not match MSI's overview.
 * MSI labels 80A on the 14 Vcore stages only. ASUS labels up to 80A on
 * 14+2+1. Slot generations below are the Ryzen 9000 and 7000 rows.
 * dataPointCount stays 0. winnerName stays null. isHumanReviewed stays false.
 * No prices. No frame-rate result. No EDITORIAL_INBOUND_RELATED edit.
 * Reddit returned 403, so there is no community-opinion block.
 */

const A = "msi-mag-b850-tomahawk-max-wifi";
const B = "asus-tuf-gaming-b850-plus-wifi";

const MSI_SPEC = "https://www.msi.com/Motherboard/MAG-B850-TOMAHAWK-MAX-WIFI/Specification";
const MSI_OVERVIEW = "https://www.msi.com/Motherboard/MAG-B850-TOMAHAWK-MAX-WIFI/Overview";
const MSI_MANUAL = "https://download-2.msi.com/archive/mnu_exe/mb/MAGB850TOMAHAWKMAXWIFI_English.pdf";
const ASUS_PRODUCT =
  "https://www.asus.com/motherboards-components/motherboards/tuf-gaming/tuf-gaming-b850-plus-wifi/";
const ASUS_TECH =
  "https://www.asus.com/motherboards-components/motherboards/tuf-gaming/tuf-gaming-b850-plus-wifi/techspec/";
const ASUS_MANUAL =
  "https://dlcdnets.asus.com/pub/ASUS/mb/SocketAM5/TUF_GAMING_B850-PLUS_WIFI/E25809_TUF_GAMING_B850-PLUS_WIFI_UM_V2_WEB.pdf";
const AMD_9800X3D =
  "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9800x3d.html";

const SOURCE_DATE = "2026-11-14";
const PUBLISHED = "2026-11-14T00:00:00Z";
const SPEC = "Specs";

const SHORT_ANSWER =
  "Choose the MSI MAG B850 Tomahawk Max WiFi if you will use four M.2 slots, including two CPU PCIe 5.0 x4 slots on a Ryzen 9000 or 7000 processor, Realtek 5G LAN, or Wi-Fi 7 at 320 MHz up to 5.8 Gbps. Choose the ASUS TUF Gaming B850-Plus WiFi if three M.2 slots, Realtek 2.5Gb Ethernet, and Wi-Fi 7 at 160 MHz up to 2.9 Gbps are enough, and neither board is right for everyone.";

const VERDICT = `Choose the MSI MAG B850 Tomahawk Max WiFi if you will fill four M.2 slots, use the Realtek 8126VB 5G LAN port, or use the 320 MHz Wi-Fi 7 listing (up to 5.8 Gbps). On a Ryzen 9000 or 7000 processor, MSI lists two CPU M.2 slots at up to PCIe 5.0 x4, plus a chipset PCIe 4.0 x2 slot and a chipset PCIe 4.0 x4 slot.

Choose the ASUS TUF Gaming B850-Plus WiFi if three M.2 slots, the Realtek 2.5Gb port, and the 160 MHz Wi-Fi 7 listing (up to 2.9 Gbps) cover the build. On a Ryzen 9000 or 7000 processor, ASUS lists one CPU PCIe 5.0 x4 M.2 slot, one CPU PCIe 4.0 x4 M.2 slot, and one chipset PCIe 4.0 x4 M.2 slot.

Neither board is right for everyone. Compare the current price at the retailer. MSI's overview labels 80A on the 14 Vcore stages and leaves the SOC and MISC stages without an amp figure. ASUS lists 14(80A)+2(80A)+1(80A), up to 80A each.`;

const SPEC_TABLE = [
  "Maker listings opened 14 November 2026. M.2 and graphics generations are the Ryzen 9000 and 7000 rows. Wi-Fi figures are the makers' up-to rates.",
  "| Spec | MSI MAG B850 Tomahawk Max WiFi | ASUS TUF Gaming B850-Plus WiFi |",
  "| --- | --- | --- |",
  "| Chipset and socket | AMD B850, Socket AM5 | AMD B850, Socket AM5 |",
  "| CPU families listed | Ryzen 9000, 8000, and 7000 desktop | Ryzen 9000, 8000, and 7000 desktop |",
  "| Power-stage listing | 14+2+1 Duet Rail. 14 Vcore stages SPS 80A. SOC and MISC have no amp figure on the overview | 14(80A)+2(80A)+1(80A), packages rated for up to 80A each |",
  "| Graphics slot, Ryzen 9000 or 7000 | PCIe 5.0 x16 from the CPU | PCIe 5.0 x16 from the CPU, x16 mode |",
  "| M.2 slots, Ryzen 9000 or 7000 | 4. Two CPU PCIe 5.0 x4, chipset PCIe 4.0 x2, chipset PCIe 4.0 x4 | 3. CPU PCIe 5.0 x4, CPU PCIe 4.0 x4, chipset PCIe 4.0 x4 |",
  "| Second long slot when M.2_3 is used | PCI_E3 drops to x2. BIOS can set PCI_E3 to x4 and disable M2_3 | PCIEX16(G4) is disabled |",
  "| Wired LAN | Realtek 8126VB 5G | Realtek 2.5Gb, TUF LANGuard |",
  "| Wi-Fi 7 listing | 2.4, 5, and 6 GHz, 320 MHz, up to 5.8 Gbps | 2x2, 2.4, 5, and 6 GHz, 160 MHz, up to 2.9 Gbps |",
  "| USB 20 Gbps Type-C | 1 front. None on the rear | 1 rear. Front Type-C is USB 10 Gbps |",
  "| Fan and pump headers | 1 CPU, 1 pump or system, 6 system | 1 CPU, 1 CPU OPT, 1 AIO pump, 4 chassis |",
  "| Form factor | ATX, 243.84 mm by 304.8 mm | ATX, 12 inch by 9.6 inch (30.5 cm by 24.4 cm) |",
].join("\n");

const CHOOSE_TABLE = [
  "Choose-if rows from the maker listings above. No row is a ranked result, and no row is a price.",
  "| Situation | Choose the Tomahawk Max WiFi if | Choose the TUF B850-Plus WiFi if |",
  "| --- | --- | --- |",
  "| NVMe drives | You will use four M.2 slots | Three M.2 slots are enough |",
  "| PCIe 5.0 SSDs on a Ryzen 9000 or 7000 CPU | You want two CPU PCIe 5.0 x4 M.2 slots | One CPU PCIe 5.0 x4 M.2 slot is enough |",
  "| Wired network | You want the Realtek 5G port | The Realtek 2.5Gb port is enough |",
  "| Wi-Fi 7 channel width | You want the 320 MHz listing, up to 5.8 Gbps | The 160 MHz listing, up to 2.9 Gbps, is enough |",
  "| Rear USB 20 Gbps | A front USB 20 Gbps Type-C port is the fast port you need | You want the 20 Gbps Type-C port on the rear |",
  "| Second long slot plus M.2_3 | You can run PCI_E3 at x2, or give up M2_3 | You can leave M.2_3 empty |",
].join("\n");

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways.

- Choose the Tomahawk Max WiFi for four M.2 slots, two of them CPU PCIe 5.0 x4 on a Ryzen 9000 or 7000 processor, Realtek 5G LAN, or 320 MHz Wi-Fi 7 up to 5.8 Gbps.
- Choose the TUF B850-Plus WiFi when three M.2 slots, Realtek 2.5Gb Ethernet, and 160 MHz Wi-Fi 7 up to 2.9 Gbps are enough.
- Both boards list a PCIe 5.0 x16 graphics slot from the CPU for Ryzen 9000 and 7000 processors.
- MSI labels 80A on 14 Vcore stages. ASUS labels up to 80A on 14 Vcore, 2 SOC, and 1 misc stage.
- Filling M.2_3 drops MSI's PCI_E3 to x2, and it disables ASUS's PCIEX16(G4).
- AMD lists the Ryzen 7 9800X3D on Socket AM5 with B850 among its supporting chipsets. That listing is not a temperature or frame-rate result.

## Specs side by side

On a Ryzen 9000 or 7000 processor, both boards list a PCIe 5.0 x16 graphics slot from the CPU. The other rows are storage, networking, USB, and headers.

${SPEC_TABLE}

## Which board to choose

Choose the Tomahawk Max WiFi when you will use the fourth M.2 slot, the second CPU PCIe 5.0 SSD slot, the 5G port, or the 320 MHz Wi-Fi 7 listing. Choose the TUF B850-Plus WiFi when three M.2 slots, 2.5Gb Ethernet, and the 160 MHz Wi-Fi 7 listing cover the build.

${CHOOSE_TABLE}

Four checks, in order. 1. Count the M.2 drives you will install on a Ryzen 9000 or 7000 processor: four on the Tomahawk Max WiFi, three on the TUF B850-Plus WiFi. 2. Decide whether the second long slot must stay available while M.2_3 is filled. 3. Pick the LAN port and the Wi-Fi 7 channel width you will use. 4. Compare the current price at the retailer. Store prices move.

## Power stages

MSI's overview lists a 14+2+1 Duet Rail power system and an 80A Smart Power Stage. The same overview labels 14 Vcore phases SPS 80A, then 2 SOC phases and 1 MISC phase with no amp figure beside them. It also lists 8 PCB layers, 2 oz thickened copper, and dual power connectors.

ASUS's product copy lists 14(80A) + 2(80A) + 1(80A) power stages that integrate high-side and low-side MOSFETs and drivers into packages rated for up to 80A each. The breakdown is 14 Vcore, 2 SOC, and 1 misc, each marked 80A DrMOS. The same copy heads a section "Eight Layered PCB design" and describes proprietary 8+8 pin ProCool connectors. The tech spec lists one 24-pin main power connector and two 8-pin +12V CPU power connectors.

MSI's specification lists two CPU power connectors and one extra 8-pin PCIE_PWR connector. Those two power-stage sentences are not the same listing. MSI's overview says the board is ready for the challenge of high-end processors. ASUS says the stages are there to meet the needs of high-core-count CPUs. Neither sentence is a temperature result.

## Storage and the second slot

For Ryzen 9000 and 7000 processors, MSI lists four M.2 slots: M.2_1 and M.2_2 from the CPU at up to PCIe 5.0 x4, M.2_3 from the chipset at up to PCIe 4.0 x2, and M.2_4 from the chipset at up to PCIe 4.0 x4. M.2_1 takes 22110 or 2280. The other three take 2280 or 2260. MSI also lists four SATA 6G ports and RAID 0, RAID 1, and RAID 10 for M.2 NVMe devices.

MSI lists three PCI-E x16 slots. PCI_E1 is PCIe 5.0 up to x16 from the CPU for Ryzen 9000 and 7000. PCI_E2 is PCIe 3.0 up to x1 from the chipset. PCI_E3 is PCIe 4.0 up to x4 from the chipset. Installing a device in M2_3 runs PCI_E3 at x2. Switching PCI_E3 to x4 in the BIOS disables M2_3.

For the same processors, ASUS lists three M.2 slots: M.2_1 type 2280 at PCIe 5.0 x4 from the CPU, M.2_2 type 2242, 2260, 2280, or 22110 at PCIe 4.0 x4 from the CPU, and M.2_3 type 2280 at PCIe 4.0 x4 from the chipset. ASUS also lists four SATA 6Gb/s ports. RAIDXpert2 on Ryzen 9000 is RAID 0, 1, 5, and 10. On Ryzen 7000 it is RAID 0, 1, and 10.

ASUS lists one PCIe 5.0 x16 slot in x16 mode for Ryzen 9000 and 7000, one PCIe 4.0 x16 slot in x4 mode from the chipset, and two PCIe 4.0 x1 slots. PCIEX16(G4) shares bandwidth with M.2_3 and is disabled when M.2_3 runs.

Ryzen 8000 processors are a different row on both boards. MSI lists PCI_E1 at PCIe 4.0 x8 for Ryzen 8700, 8600, and 8400, and at PCIe 4.0 x4 for Ryzen 8500 and 8300. M.2_1 drops to PCIe 4.0 x4 on Ryzen 8000. ASUS lists the main slot at PCIe 4.0 x8 or x4 for Ryzen 8000, and M.2_1 at PCIe 4.0 x4. A Ryzen 7 9800X3D is a 9000-series processor, so the 9000 row is the one that applies to that chip.

## Networking

MSI lists a Realtek 8126VB 5G LAN port. The wireless row is a pre-installed Wi-Fi 7 module in the M.2 Key-E slot: 802.11be, 2.4 GHz, 5 GHz, and 6 GHz, 320 MHz, up to 5.8 Gbps, plus Bluetooth 5.4, MLO, and 4KQAM. MSI says 6 GHz support depends on each country's rules, Wi-Fi 7 is ready in Windows 11 version 24H2, and the Bluetooth version may be updated. The manual lists two Wi-Fi antenna connectors.

ASUS lists one Realtek 2.5Gb Ethernet port with TUF LANGuard, and 2x2 Wi-Fi 7 (802.11be) on 2.4 GHz, 5 GHz, and 6 GHz, with 160 MHz bandwidth and up to 2.9 Gbps. Bluetooth is listed as v5.4, and ASUS says that version may vary. Wi-Fi features depend on the operating system. For Windows 11, ASUS says Wi-Fi 7 needs version 24H2 or later, and that 21H2, 22H2, and 23H2 support Wi-Fi 6E only. 6 GHz rules vary by country.

## USB, fans, and the BIOS button

MSI's rear USB count is 4x USB 2.0, 1x USB 5Gbps Type-A, 2x USB 10Gbps Type-A, and 3x USB 10Gbps Type-C. The front headers are 4x USB 2.0, 4x USB 5Gbps Type-A, and 1x USB 20Gbps Type-C. The 20 Gbps Type-C port is on the front, not the rear. The rear panel also has a Flash BIOS Button, a Clear CMOS button, and an HDMI 2.1 FRL port up to 8K 60Hz when the processor has integrated graphics.

ASUS lists 10 rear USB ports: 1x USB 20Gbps Type-C, 3x USB 10Gbps Type-A, 4x USB 5Gbps Type-A, and 2x USB 2.0 Type-A. Front USB is 7 ports: one USB 10Gbps Type-C connector, one USB 5Gbps header for two ports, and two USB 2.0 headers for four ports. ASUS lists USB Type-C power delivery at a maximum of 5V/3A. The rear panel also has DisplayPort up to 8K at 30Hz (DisplayPort 1.4) and HDMI up to 4K at 60Hz (HDMI 2.1), plus a BIOS FlashBack button.

MSI's manual lists one 4-pin CPU fan, one 4-pin water-pump or system fan, and six 4-pin system fans. CPU_FAN1 is auto mode at 2A and 24W. PUMP_SYS1 is PWM mode at 3A and 36W. SYS_FAN1 through SYS_FAN6 are auto mode at 1A and 12W each. ASUS lists one 4-pin CPU fan header, one 4-pin CPU OPT fan header, one 4-pin AIO pump header, and four 4-pin chassis fan headers. ASUS does not pair those headers with an amp figure in the tech spec.

MSI's manual says the Flash BIOS Button needs the power supply connected to CPU_PWR1 and ATX_PWR1, and that you do not need to install the CPU and memory. Rename the file to MSI.ROM, use the rear Flash BIOS port, and press the button. ASUS's manual says BIOS FlashBack updates the BIOS without entering the existing BIOS or operating system. The steps connect the 24-pin power connector, turn the power supply on without powering on the system, and hold the button for three seconds. Those steps do not say the processor can be left out.

Audio differs too. MSI lists a Realtek ALC4080 7.1 codec, with up to 32-bit/384 kHz playback on the front panel. ASUS lists a Realtek ALC1220P 7.1 codec, with up to 32-bit/192 kHz playback, and says 32-bit/192 kHz is not supported for 7.1 surround because of HDA bandwidth.

## A Ryzen 7 9800X3D and a graphics card

AMD lists the Ryzen 7 9800X3D as a Ryzen 9000 Series desktop processor for Socket AM5, with DDR5, PCIe 5.0, a 120 W default TDP, and a 95°C Tjmax. Supporting chipsets include B850. AMD's max memory speed row for this processor is DDR5-5600 for two single-rank or two dual-rank modules. The board OC figures sit above that row: MSI lists up to 8400+ MT/s for one single-rank module per channel on Ryzen 9000, and ASUS lists up to 8000+ MT/s with OC. Both list four DDR5 slots, a 256 GB maximum, and AMD EXPO. ASUS also lists AEMP. MSI lists CUDIMM support in clock-driver bypass mode only, and says some CPUs may fail to boot.

MSI and ASUS both list Socket AM5 support for Ryzen 9000, 8000, and 7000 series desktop processors. AMD also says a liquid cooler is recommended for this processor. No temperature for a 9800X3D on either board is included here.

No frame-rate result is included. The processor and the graphics card stay the same when the board changes. For a Ryzen 9000 or 7000 processor, both boards wire the main graphics slot as PCIe 5.0 x16 from the CPU. The differences the makers list are storage, networking, USB, fan headers, and the power-stage wording.

B650 vs B850 and B850 vs X870 compare chipset names. This pair is two B850 boards, so the slot wiring comes from MSI and ASUS.`;

const FAQS = [
  {
    question: "Can the ASUS TUF Gaming B850-Plus WiFi handle a Ryzen 7 9800X3D?",
    answer:
      "ASUS lists Socket AM5 support for Ryzen 9000, 8000, and 7000 series desktop processors, and AMD lists the Ryzen 7 9800X3D as a Ryzen 9000 Series chip whose supporting chipsets include B850. ASUS lists 14(80A)+2(80A)+1(80A) power stages rated for up to 80A each. AMD lists a 120 W default TDP and recommends a liquid cooler. That is a support listing, not a temperature result for this board.",
  },
  {
    question: "What does the MSI MAG B850 Tomahawk Max WiFi have that the TUF B850-Plus WiFi does not?",
    answer:
      "On a Ryzen 9000 or 7000 processor, MSI lists four M.2 slots, two of them CPU PCIe 5.0 x4, a Realtek 8126VB 5G LAN port, and Wi-Fi 7 at 320 MHz up to 5.8 Gbps. ASUS lists three M.2 slots, one of them CPU PCIe 5.0 x4, Realtek 2.5Gb Ethernet, and Wi-Fi 7 at 160 MHz up to 2.9 Gbps. MSI also lists a front USB 20 Gbps Type-C port and an extra 8-pin PCIE_PWR connector. ASUS lists the 20 Gbps Type-C port on the rear.",
  },
  {
    question: "Will gaming performance differ between these two boards?",
    answer:
      "No frame-rate result is included. The processor and the graphics card stay the same when the board changes. For a Ryzen 9000 or 7000 processor, both boards list a PCIe 5.0 x16 graphics slot from the CPU. The differences the makers list are storage, networking, USB, fan headers, and the power-stage wording.",
  },
  {
    question: "What happens when the third M.2 slot is occupied?",
    answer:
      "On the Tomahawk Max WiFi, installing a device in M2_3 runs PCI_E3 at x2. MSI says you can switch PCI_E3 back to x4 in the BIOS, and that switch disables M2_3. On the TUF B850-Plus WiFi, PCIEX16(G4) shares bandwidth with M.2_3 and is disabled when M.2_3 runs. The main CPU graphics slot is a different slot on both boards.",
  },
  {
    question: "Is Wi-Fi 7 the same speed on both boards?",
    answer:
      "No. MSI lists 320 MHz and up to 5.8 Gbps. ASUS lists 2x2 Wi-Fi 7 at 160 MHz and up to 2.9 Gbps. Both list 2.4 GHz, 5 GHz, and 6 GHz, and both say 6 GHz depends on local rules. MSI says Wi-Fi 7 is ready in Windows 11 version 24H2. ASUS says Windows 11 needs 24H2 or later for Wi-Fi 7, and that 21H2, 22H2, and 23H2 support Wi-Fi 6E only.",
  },
  {
    question: "Can you flash the BIOS before the processor is installed?",
    answer:
      "MSI's manual says the Flash BIOS Button needs power on CPU_PWR1 and ATX_PWR1, and that you do not need to install the CPU and memory. ASUS's manual says BIOS FlashBack updates the BIOS without entering the existing BIOS or operating system, after the 24-pin connector is attached and the power supply is on. ASUS's steps do not say the processor can be left out. Read the CPU support list for the BIOS version that names the Ryzen 7 9800X3D.",
  },
];

const BUILT = buildEditorialComparison({
  slug: "msi-mag-b850-tomahawk-max-wifi-vs-asus-tuf-gaming-b850-plus-wifi",
  title: "B850 Tomahawk Max vs TUF B850-Plus",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "MSI MAG B850 Tomahawk Max WiFi",
      shortDesc:
        "AMD B850 ATX board with four M.2 slots, Realtek 5G LAN, and a 320 MHz Wi-Fi 7 listing up to 5.8 Gbps.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [],
      cons: [],
      bestFor: null,
    },
    {
      id: B,
      slug: B,
      name: "ASUS TUF Gaming B850-Plus WiFi",
      shortDesc:
        "AMD B850 ATX board with three M.2 slots, Realtek 2.5Gb Ethernet, and a 160 MHz Wi-Fi 7 listing up to 2.9 Gbps.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [],
      cons: [],
      bestFor: null,
    },
  ],
  keyDifferences: [
    {
      label: "Power-stage listing",
      entityAValue: "14+2+1. 14 Vcore stages SPS 80A. SOC and MISC have no amp figure",
      entityBValue: "14(80A)+2(80A)+1(80A), up to 80A each",
      winner: "tie",
    },
    {
      label: "M.2 slots, Ryzen 9000 or 7000",
      entityAValue: "4: two CPU PCIe 5.0 x4, chipset PCIe 4.0 x2, chipset PCIe 4.0 x4",
      entityBValue: "3: CPU PCIe 5.0 x4, CPU PCIe 4.0 x4, chipset PCIe 4.0 x4",
      winner: "tie",
    },
    {
      label: "M.2_3 and the second long slot",
      entityAValue: "PCI_E3 drops to x2, or x4 with M2_3 disabled",
      entityBValue: "PCIEX16(G4) is disabled",
      winner: "tie",
    },
    {
      label: "Wired LAN",
      entityAValue: "Realtek 8126VB 5G",
      entityBValue: "Realtek 2.5Gb",
      winner: "tie",
    },
    {
      label: "Wi-Fi 7 listing",
      entityAValue: "320 MHz, up to 5.8 Gbps",
      entityBValue: "2x2, 160 MHz, up to 2.9 Gbps",
      winner: "tie",
    },
    {
      label: "USB 20 Gbps Type-C",
      entityAValue: "1 front. None on the rear",
      entityBValue: "1 rear. Front Type-C is 10 Gbps",
      winner: "tie",
    },
    {
      label: "Fan and pump headers",
      entityAValue: "1 CPU, 1 pump or system, 6 system",
      entityBValue: "1 CPU, 1 CPU OPT, 1 AIO pump, 4 chassis",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("chipset", "Chipset", SPEC, A, B, "AMD B850, Socket AM5", "AMD B850, Socket AM5"),
    textAttr(
      "cpu",
      "CPU families listed",
      SPEC,
      A,
      B,
      "Ryzen 9000, 8000, and 7000 desktop (MSI)",
      "Ryzen 9000, 8000, and 7000 desktop (ASUS)",
    ),
    textAttr(
      "vrm",
      "Power-stage listing",
      SPEC,
      A,
      B,
      "14+2+1 Duet Rail. 14 Vcore stages SPS 80A. SOC and MISC have no amp figure (MSI overview)",
      "14(80A)+2(80A)+1(80A), up to 80A each (ASUS)",
    ),
    textAttr(
      "gpu",
      "Graphics slot, Ryzen 9000 or 7000",
      SPEC,
      A,
      B,
      "PCIe 5.0 x16 from the CPU (MSI)",
      "PCIe 5.0 x16 from the CPU, x16 mode (ASUS)",
    ),
    textAttr(
      "m2",
      "M.2 slots, Ryzen 9000 or 7000",
      SPEC,
      A,
      B,
      "4: two CPU PCIe 5.0 x4, chipset PCIe 4.0 x2, chipset PCIe 4.0 x4 (MSI)",
      "3: CPU PCIe 5.0 x4, CPU PCIe 4.0 x4, chipset PCIe 4.0 x4 (ASUS)",
    ),
    textAttr(
      "share",
      "Second long slot when M.2_3 is used",
      SPEC,
      A,
      B,
      "PCI_E3 drops to x2. BIOS can set PCI_E3 to x4 and disable M2_3 (MSI)",
      "PCIEX16(G4) is disabled (ASUS)",
    ),
    textAttr("lan", "Wired LAN", SPEC, A, B, "Realtek 8126VB 5G (MSI)", "Realtek 2.5Gb, TUF LANGuard (ASUS)"),
    textAttr(
      "wifi",
      "Wi-Fi 7 listing",
      SPEC,
      A,
      B,
      "320 MHz, up to 5.8 Gbps. Windows 11 24H2 for Wi-Fi 7 (MSI)",
      "2x2, 160 MHz, up to 2.9 Gbps. Windows 11 24H2 or later for Wi-Fi 7 (ASUS)",
    ),
    textAttr(
      "usb20",
      "USB 20 Gbps Type-C",
      SPEC,
      A,
      B,
      "1 front. Rear has 3x USB 10 Gbps Type-C (MSI)",
      "1 rear. Front Type-C is USB 10 Gbps (ASUS)",
    ),
    textAttr(
      "fans",
      "Fan and pump headers",
      SPEC,
      A,
      B,
      "1 CPU (2A, 24W), 1 pump or system (3A, 36W), 6 system (1A, 12W) (MSI manual)",
      "1 CPU, 1 CPU OPT, 1 AIO pump, 4 chassis (ASUS). No amp figure in the tech spec",
    ),
    textAttr(
      "bios",
      "BIOS button",
      SPEC,
      A,
      B,
      "Flash BIOS Button. Manual: CPU and memory not required",
      "BIOS FlashBack button. Manual: no need to enter BIOS or the OS. Steps do not leave the CPU out",
    ),
    textAttr(
      "memory",
      "Memory",
      SPEC,
      A,
      B,
      "4x DDR5, 256 GB, EXPO. Ryzen 9000 1DPC 1R up to 8400+ MT/s (MSI). AMD lists DDR5-5600 for the 9800X3D",
      "4x DDR5, 256 GB, EXPO and AEMP, up to 8000+ MT/s OC (ASUS). AMD lists DDR5-5600 for the 9800X3D",
    ),
    textAttr(
      "board",
      "Form factor",
      SPEC,
      A,
      B,
      "ATX, 243.84 mm by 304.8 mm. 8 PCB layers (MSI overview)",
      "ATX, 12 by 9.6 inch. Heading: Eight Layered PCB design (ASUS)",
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "b650-vs-b850",
      title: "B650 vs B850: Which AM5 Chipset for a Gaming PC?",
      category: "technology",
    },
    {
      slug: "b850-vs-x870",
      title: "B850 vs X870: Which AM5 Chipset for a Gaming PC?",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: null,
    keyFact:
      "On a Ryzen 9000 or 7000 processor, MSI lists four M.2 slots and Realtek 5G LAN, and ASUS lists three M.2 slots and Realtek 2.5Gb Ethernet. Both list a PCIe 5.0 x16 graphics slot from the CPU.",
  },
  citationStats: {
    sourceCount: 7,
    dataPointCount: 0,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "MSI MAG B850 Tomahawk Max WiFi specification", url: MSI_SPEC },
      { name: "MSI MAG B850 Tomahawk Max WiFi overview", url: MSI_OVERVIEW },
      { name: "MSI MAG B850 Tomahawk Max WiFi English manual", url: MSI_MANUAL },
      { name: "ASUS TUF Gaming B850-Plus WiFi product page", url: ASUS_PRODUCT },
      { name: "ASUS TUF Gaming B850-Plus WiFi tech spec", url: ASUS_TECH },
      { name: "ASUS TUF Gaming B850-Plus WiFi user manual", url: ASUS_MANUAL },
      { name: "AMD Ryzen 7 9800X3D specifications", url: AMD_9800X3D },
    ],
  },
  resources: [
    {
      type: "external",
      label: "MSI MAG B850 Tomahawk Max WiFi specification",
      url: MSI_SPEC,
      description:
        "Opened 14 November 2026. Four M.2 slots, Realtek 8126VB 5G LAN, Wi-Fi 7 at 320 MHz up to 5.8 Gbps, PCI_E3 drops to x2 when M2_3 is used, and the USB counts used here.",
    },
    {
      type: "external",
      label: "MSI MAG B850 Tomahawk Max WiFi overview",
      url: MSI_OVERVIEW,
      description:
        "Opened 14 November 2026. 14+2+1 Duet Rail, 14 Vcore phases SPS 80A, 8 PCB layers, and 2 oz thickened copper. SOC and MISC phases have no amp figure there.",
    },
    {
      type: "external",
      label: "MSI MAG B850 Tomahawk Max WiFi English manual",
      url: MSI_MANUAL,
      description:
        "Opened 14 November 2026. Fan header current, and Flash BIOS Button steps that do not need the CPU or memory installed.",
    },
    {
      type: "external",
      label: "ASUS TUF Gaming B850-Plus WiFi product page",
      url: ASUS_PRODUCT,
      description:
        "Opened 14 November 2026. 14(80A)+2(80A)+1(80A) power stages rated for up to 80A each, an Eight Layered PCB heading, and 8+8 pin ProCool connectors.",
    },
    {
      type: "external",
      label: "ASUS TUF Gaming B850-Plus WiFi tech spec",
      url: ASUS_TECH,
      description:
        "Opened 14 November 2026. Three M.2 slots, Realtek 2.5Gb Ethernet, 2x2 Wi-Fi 7 at 160 MHz up to 2.9 Gbps, USB counts, and fan headers.",
    },
    {
      type: "external",
      label: "ASUS TUF Gaming B850-Plus WiFi user manual",
      url: ASUS_MANUAL,
      description:
        "Opened 14 November 2026. PCIEX16(G4) is disabled when M.2_3 runs. BIOS FlashBack steps do not enter the BIOS or the operating system.",
    },
    {
      type: "external",
      label: "AMD Ryzen 7 9800X3D specifications",
      url: AMD_9800X3D,
      description:
        "Opened 14 November 2026. Ryzen 9000 Series, Socket AM5, B850 among supporting chipsets, 120 W default TDP, DDR5-5600 on the memory-speed row, liquid cooler recommended.",
    },
  ],
  metaTitle: "B850 Tomahawk Max vs TUF B850-Plus",
});

BUILT.metadata.metaDescription =
  "Choose the MSI B850 Tomahawk Max WiFi for four M.2 slots, 5G LAN, or 320 MHz Wi-Fi 7. Choose the ASUS TUF B850-Plus WiFi for three M.2 slots and 2.5Gb Ethernet.";

export const MSI_MAG_B850_TOMAHAWK_MAX_WIFI_VS_ASUS_TUF_B850_PLUS_WIFI: EditorialComparison = BUILT;
