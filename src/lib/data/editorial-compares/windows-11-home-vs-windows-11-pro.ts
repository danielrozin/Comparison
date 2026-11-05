import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-380 — Windows 11 Home vs Windows 11 Pro for a gaming PC.
 * Opened 5 November 2026.
 * Requirements and setup: Microsoft Windows 11 specifications.
 * Edition marks: Microsoft's business edition comparison (checkmark cells
 * read from the live table: Home, Pro, Pro for Workstations).
 * Device Encryption, Remote Desktop host, and the Home-to-Pro upgrade:
 * Microsoft Support. Hyper-V, Windows Sandbox, and physical memory limits:
 * Microsoft Learn. No winner. No prices. No frame rates.
 * Reddit returned HTTP 403, so there is no community block.
 * LTSC is not named on the pages opened, so it is left out.
 */

const HOME = "windows-11-home";
const PRO = "windows-11-pro";

const SPECS = "https://www.microsoft.com/en-us/windows/windows-11-specifications";
const COMPARE = "https://www.microsoft.com/en-us/windows/business/compare-windows-11";
const DEVICE_ENCRYPTION =
  "https://support.microsoft.com/en-us/windows/device-encryption-in-windows-cf7e2b6f-3e70-4882-9532-18633605b7df";
const REMOTE_DESKTOP =
  "https://support.microsoft.com/en-us/windows/how-to-use-remote-desktop-5fe128d5-8fb1-7a23-3b8a-41e636865e8c";
const HYPER_V =
  "https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v";
const SANDBOX =
  "https://learn.microsoft.com/en-us/windows/security/application-security/application-isolation/windows-sandbox/";
const SANDBOX_INSTALL =
  "https://learn.microsoft.com/en-us/windows/security/application-security/application-isolation/windows-sandbox/windows-sandbox-install";
const MEMORY =
  "https://learn.microsoft.com/en-us/windows/win32/memory/memory-limits-for-windows-releases";
const UPGRADE =
  "https://support.microsoft.com/en-us/windows/upgrade-windows-home-to-windows-pro-ef34d520-e73f-3198-c525-d1a218cc2818";

const SOURCE_DATE = "2026-11-05";
const PUBLISHED = "2026-11-05T00:00:00Z";
const SPEC = "Edition";

const SHORT_ANSWER =
  "For a gaming PC, Windows 11 Home and Windows 11 Pro use the same minimum hardware requirements Microsoft lists for Windows 11. Pro extras such as BitLocker, Remote Desktop hosting, Hyper-V, Windows Sandbox, Group Policy, and domain or Microsoft Entra ID join are features you turn on, not a separate gaming specification. Get Pro if you need one of those features, or if the two cost the same from Microsoft or an authorized retailer. Otherwise Home is enough, and you can upgrade an activated copy of Home to Pro later in the Microsoft Store.";

const FAQS = [
  {
    question: "Is Windows 11 Pro better than Home for gaming?",
    answer:
      "No. Games run the same on both editions. Pro adds business and power-user features such as BitLocker, Remote Desktop hosting, Hyper-V and Windows Sandbox, none of which raise frame rates.",
  },
  {
    question: "Does Windows 11 Pro use more system resources than Home?",
    answer:
      "Microsoft lists the same minimum hardware requirements for both editions. Pro-only features like Hyper-V and Windows Sandbox are optional features that you have to turn on.",
  },
  {
    question: "Can I set up Windows 11 Pro without a Microsoft account?",
    answer:
      "Not for personal use. Microsoft says Windows 11 Home and Windows 11 Pro for personal use both need an internet connection and a Microsoft account during initial setup.",
  },
  {
    question: "Does Windows 11 Home have encryption?",
    answer:
      "Yes, on supported hardware. Home has Device Encryption, which uses BitLocker to encrypt your drives automatically when you sign in with a Microsoft account. Full BitLocker Drive Encryption is available on Pro, Enterprise and Education.",
  },
  {
    question: "Can I upgrade from Windows 11 Home to Pro later?",
    answer:
      "Yes. You can buy the upgrade in the Microsoft Store or enter a Pro product key in Settings > System > Activation. Microsoft's steps apply to an activated copy of Home.",
  },
  {
    question: "Can I use Remote Desktop on Windows 11 Home?",
    answer:
      "You can connect from a Home PC to another computer, but a Home PC can't be the remote PC you connect to. That requires Pro.",
  },
];

const VERDICT = `Gamer: Home is enough unless you need a Pro feature, or Home and Pro cost the same from Microsoft or an authorized retailer. Microsoft lists one set of minimum hardware requirements for Windows 11.

Home user: Home. Microsoft's edition comparison marks Device encryption on Home. Microsoft Support says Device Encryption can turn on when you sign in with a Microsoft account, on hardware that supports it.

Remote work or IT: Pro. Microsoft Support says the PC you connect to must run a Pro edition. Microsoft's comparison marks Group Policy and domain join on Pro.

Developer running virtual machines: Pro. Microsoft Learn says Hyper-V cannot be installed on Windows 11 Home, and Windows Sandbox is not supported on Windows Home.

Neither edition is the right pick for every PC.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

Microsoft lists one set of minimum requirements for installing Windows 11: a 1 GHz or faster processor with 2 or more cores on a compatible 64-bit processor or system on a chip, 4 GB of RAM, a 64 GB or larger storage device, UEFI firmware that is Secure Boot capable, Trusted Platform Module (TPM) version 2.0, a graphics card compatible with DirectX 12 or later with a WDDM 2.0 driver, and a high definition (720p) display greater than 9 inches diagonally with 8 bits per color channel.

Microsoft's edition comparison marks Device encryption, and automatic encryption on capable devices, on Home and on Pro. It marks BitLocker device encryption, Remote desktop, Group Policy, Azure Active Directory Join, Hybrid Azure Active Directory Join, and Support for Active Directory on Pro, and leaves those rows unmarked on Home.

Microsoft Learn lists a physical memory limit of 128 GB for Windows 11 Home and 2 TB for Windows 11 Pro, on X64 and on ARM64.

Microsoft Support says you can connect from a Home PC to another computer. The PC you connect to must run a Pro edition.

Microsoft Learn says the Hyper-V role can't be installed on Windows 11 Home, and that Windows Sandbox is not supported on Windows Home. Hyper-V is an optional feature. Windows Sandbox is turned on from Turn Windows features on or off.

Microsoft says Windows 11 Home and Windows 11 Pro for personal use require internet connectivity and a Microsoft account during initial device setup.

Quick verdict by buyer

Gamer: choose Home when you do not need a Pro feature. Microsoft publishes one minimum hardware list for Windows 11, not a second list for Pro. Get Pro if you need BitLocker management, Remote Desktop hosting, Hyper-V, Windows Sandbox, Group Policy, domain or Microsoft Entra ID join, or more physical memory than the 128 GB Home limit. Also get Pro if Home and Pro cost the same from Microsoft or an authorized retailer.

Home user: Home includes the Device encryption row on Microsoft's comparison. Microsoft Support says Device Encryption enables BitLocker encryption and can turn on when you first sign in with a Microsoft account, or a work or school account, on a device that supports it. A local account does not turn Device Encryption on automatically.

Remote work or IT: Pro. Microsoft Support says the remote PC must run a Pro edition. The client can be Home. Microsoft's comparison marks Group Policy, Azure Active Directory Join, Hybrid Azure Active Directory Join, and Support for Active Directory on Pro. Microsoft Support says Pro includes the ability to join a domain or Microsoft Entra ID.

Developer running virtual machines: Pro. Microsoft Learn requires Windows 11 Pro or Enterprise for Hyper-V, and lists Windows Pro as an edition that supports Windows Sandbox. Home is excluded from both.

Feature differences

Microsoft's business comparison has columns for Home, Pro, and Pro for Workstations. Check marks below are the cells in that table.

Device encryption is marked for Home, Pro, and Pro for Workstations. The row says device encryption is available on a wide range of Windows devices. Automatic encryption on capable devices is also marked for all three columns.

BitLocker device encryption is marked for Pro and Pro for Workstations, and unmarked for Home. The row names BitLocker and BitLocker To Go. Microsoft's Windows 11 specifications also list BitLocker to Go as available in Windows Pro and above editions, and say it requires a USB flash drive.

Remote desktop is marked for Pro and Pro for Workstations, and unmarked for Home. Microsoft Support separates the two roles: the PC you connect to must run a Pro edition, and the PC you connect from can run Home or Pro.

Group Policy is marked for Pro and Pro for Workstations, and unmarked for Home. The row describes managing PCs, accounts, and groups when you pair Windows 11 Pro with Windows Server. Support for Active Directory is a separate row, also marked for Pro and not for Home. Its description covers domain join and Group Policy. Azure Active Directory Join and Hybrid Azure Active Directory Join are marked for Pro and not for Home.

Performance and gaming

Microsoft lists those minimum requirements once, for installing Windows 11 on a PC. It does not publish a higher processor, RAM, storage, or graphics floor for Pro. Microsoft says certain features need specific hardware, that some apps exceed the minimum, and that performance scales with a more capable PC.

Microsoft lists DirectStorage as a Windows 11 feature that needs an NVMe SSD, games that use the Standard NVM Express Controller driver, and a DirectX 12 GPU with Shader Model 6.0 support. That line is not split by Home or Pro.

Hyper-V and Windows Sandbox do not run until you turn them on. Microsoft does not give a frame-rate difference between Home and Pro.

Encryption

Microsoft Support says Device Encryption enables BitLocker encryption automatically for the operating system drive and fixed drives. When you first sign in or set up a device with a Microsoft account, or a work or school account, Device Encryption is turned on and a recovery key is attached to that account. If you use a local account, Device Encryption is not turned on automatically. If the setting does not appear, it is unavailable on that device or you are signed in with a standard user account. Microsoft Support names TPM, Windows Recovery Environment, and Secure Boot among the reasons it can be unavailable.

Microsoft Support says BitLocker Drive Encryption is available on Windows Pro, Enterprise, or Education, and that Device Encryption is available on a wider range of devices, including those running Windows Home. Microsoft's comparison marks the BitLocker device encryption row on Pro and not on Home.

Remote Desktop

Microsoft Support says the PC you want to connect to must be running a Pro edition. On that PC you confirm the edition under Settings > System > About, then turn Remote Desktop on under Settings > System > Remote Desktop. The device you connect from can run any edition of Windows, including Home, or another operating system. From a Windows PC, Microsoft Support says to open Remote Desktop Connection, enter the PC name, and sign in.

A Home PC can be the client. It cannot be the remote PC.

Virtualization

Microsoft Learn says Hyper-V is built into Windows as an optional feature and that there is no Hyper-V download. The Windows requirements are Windows 11 Pro or Enterprise, a 64-bit processor with Second Level Address Translation (SLAT), CPU support for VM Monitor Mode Extension (VT-x on Intel CPUs), and a minimum of 4 GB of memory. Microsoft Learn also says the Hyper-V role can't be installed on Windows 11 Home. You turn it on from Turn Windows features on or off, or with Enable-WindowsOptionalFeature. Microsoft's specifications also list Client Hyper-V as available in Windows Pro and above editions, and say it requires a processor with SLAT.

Microsoft Learn says Windows Sandbox is not supported on Windows Home. Its edition table marks Windows Pro, Windows Enterprise, Windows Pro Education/SE, and Windows Education as Yes. Microsoft Learn tells you to open Turn Windows features on or off, select Windows Sandbox, and restart if you are prompted. You can also enable the optional feature Containers-DisposableClientVM. Prerequisites there include Arm64 (Windows 11, version 22H2 and later) or AMD64, virtualization enabled in BIOS, at least 4 GB of RAM (8 GB recommended), at least 1 GB of free disk space (SSD recommended), and at least two CPU cores (four cores with hyper-threading recommended). Those prerequisites apply when you install Windows Sandbox. They are not a second minimum for every Pro PC.

Memory limits

Microsoft Learn's physical memory table for Windows 11 lists Windows 11 Home at 128 GB on X64 and 128 GB on ARM64. It lists Windows 11 Pro at 2 TB on X64 and 2 TB on ARM64. A gaming PC under 128 GB does not cross that Home limit.

Setup and a Microsoft account

Microsoft's specifications say Windows 11 Pro for personal use and Windows 11 Home require internet connectivity and a Microsoft account during initial device setup. The same section says that for all Windows 11 editions, internet access is required to perform updates and to download and use some features. The personal-use account requirement is not limited to Home.

Upgrading later

Microsoft Support says you can upgrade Windows 11 Home to Windows 11 Pro in the Microsoft Store. The Store path looks for an activated Home installation. For a manual upgrade, the steps apply only to a device already running an activated copy of Windows 11 Home. With a Pro product key, you open Settings > System > Activation, choose Change next to Change product key, and enter the 25-character key. Without a key, you expand Upgrade your edition of Windows and open the Microsoft Store. After the purchase, Microsoft Support says you are prompted to install Windows 11 Pro and restart.

Buy the license from Microsoft or an authorized retailer.

Other editions

Microsoft's business comparison includes a Pro for Workstations column. Microsoft Learn also names Windows 11 Enterprise and Windows 11 Education, with their own physical memory limits. This comparison stays on Home and Pro.

Related guides: Mac vs Windows, and Mac mini M6 vs a Windows PC for video and music. Paths: /compare/mac-vs-windows, /compare/mac-mini-m6-vs-windows-pc.`;

export const WINDOWS_11_HOME_VS_WINDOWS_11_PRO: EditorialComparison = buildEditorialComparison({
  slug: "windows-11-home-vs-windows-11-pro",
  title: "Windows 11 Home vs Windows 11 Pro for a Gaming PC",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "software",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: HOME,
      slug: HOME,
      name: "Windows 11 Home",
      shortDesc: "The Windows 11 edition for a personal PC, with Device Encryption on supported hardware.",
      imageUrl: null,
      entityType: "software",
      position: 0,
      pros: [
        "Same Windows 11 minimum hardware requirements Microsoft lists for installing Windows 11",
        "Device encryption is marked on Microsoft's Home column",
        "Can connect to a remote PC. Microsoft Support says the client can be Home",
        "You can upgrade an activated copy to Pro in the Microsoft Store or with a Pro product key",
      ],
      cons: [
        "BitLocker device encryption, Group Policy, and domain join are unmarked on the Home column",
        "Cannot be the Remote Desktop PC you connect to (Microsoft Support)",
        "Hyper-V cannot be installed, and Windows Sandbox is not supported (Microsoft Learn)",
        "Physical memory limit is 128 GB on X64 and ARM64 (Microsoft Learn)",
      ],
      bestFor: "A gaming or home PC that does not need Pro features",
    },
    {
      id: PRO,
      slug: PRO,
      name: "Windows 11 Pro",
      shortDesc: "The Windows 11 edition that adds BitLocker, Remote Desktop hosting, Hyper-V, and Windows Sandbox.",
      imageUrl: null,
      entityType: "software",
      position: 1,
      pros: [
        "BitLocker device encryption, Remote desktop, and Group Policy are marked on the Pro column",
        "Can be the Remote Desktop host (Microsoft Support)",
        "Hyper-V and Windows Sandbox are available and stay off until you turn them on (Microsoft Learn)",
        "Physical memory limit is 2 TB on X64 and ARM64 (Microsoft Learn)",
      ],
      cons: [
        "Microsoft lists the same minimum hardware requirements as for Windows 11 Home",
        "Personal-use setup still needs internet and a Microsoft account (Microsoft)",
        "Hyper-V and Windows Sandbox add their own requirements only after you turn them on",
        "Buy from Microsoft or an authorized retailer. Price is not a fixed fact",
      ],
      bestFor: "Remote Desktop hosting, virtual machines, or more than 128 GB of RAM",
    },
  ],
  keyDifferences: [
    {
      label: "Minimum hardware",
      entityAValue: "Microsoft's Windows 11 minimum",
      entityBValue: "Microsoft's Windows 11 minimum",
      winner: "tie",
    },
    {
      label: "Personal setup",
      entityAValue: "Internet and a Microsoft account",
      entityBValue: "Internet and a Microsoft account",
      winner: "tie",
    },
    {
      label: "Device encryption",
      entityAValue: "Marked for Home",
      entityBValue: "Marked for Pro",
      winner: "tie",
    },
    {
      label: "BitLocker device encryption",
      entityAValue: "Unmarked for Home",
      entityBValue: "Marked for Pro",
      winner: "tie",
    },
    {
      label: "Remote Desktop host",
      entityAValue: "Client only",
      entityBValue: "Can be the remote PC",
      winner: "tie",
    },
    {
      label: "Hyper-V",
      entityAValue: "Cannot be installed",
      entityBValue: "Optional feature on Pro",
      winner: "tie",
    },
    {
      label: "Windows Sandbox",
      entityAValue: "Not supported",
      entityBValue: "Optional feature on Pro",
      winner: "tie",
    },
    {
      label: "Group Policy and domain join",
      entityAValue: "Unmarked for Home",
      entityBValue: "Marked for Pro",
      winner: "tie",
    },
    {
      label: "Physical memory limit",
      entityAValue: "128 GB",
      entityBValue: "2 TB",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "minimum",
      "Minimum hardware",
      SPEC,
      HOME,
      PRO,
      "1 GHz, 2 or more cores, 64-bit or SoC. 4 GB RAM. 64 GB storage. UEFI, Secure Boot capable. TPM 2.0. DirectX 12 with WDDM 2.0. 720p display greater than 9 inches, 8 bits per color channel",
      "Same Windows 11 minimum Microsoft lists. No separate Pro floor"
    ),
    textAttr(
      "setup",
      "Initial personal setup",
      SPEC,
      HOME,
      PRO,
      "Internet connectivity and a Microsoft account",
      "Internet connectivity and a Microsoft account, for personal use"
    ),
    textAttr(
      "device-encryption",
      "Device encryption",
      SPEC,
      HOME,
      PRO,
      "Marked. Turns on with a Microsoft account on supported hardware",
      "Marked. BitLocker Drive Encryption management is the Pro feature"
    ),
    textAttr(
      "bitlocker",
      "BitLocker device encryption",
      SPEC,
      HOME,
      PRO,
      "Unmarked. BitLocker to Go is listed for Windows Pro and above",
      "Marked, including BitLocker to Go. Requires a USB flash drive for BitLocker to Go"
    ),
    textAttr(
      "remote-desktop",
      "Remote Desktop",
      SPEC,
      HOME,
      PRO,
      "Can connect out. Cannot be the remote PC. Comparison row unmarked",
      "Can be the remote PC. Turn it on under Settings > System > Remote Desktop. Comparison row marked"
    ),
    textAttr(
      "hyper-v",
      "Hyper-V",
      SPEC,
      HOME,
      PRO,
      "The Hyper-V role can't be installed",
      "Optional feature on Pro or Enterprise. Needs SLAT, VM Monitor Mode Extension, and 4 GB of memory"
    ),
    textAttr(
      "sandbox",
      "Windows Sandbox",
      SPEC,
      HOME,
      PRO,
      "Not supported on Windows Home",
      "Supported on Pro. Turn on under Turn Windows features on or off. Install prerequisites include 4 GB of RAM, 8 GB recommended"
    ),
    textAttr(
      "group-policy",
      "Group Policy",
      SPEC,
      HOME,
      PRO,
      "Unmarked",
      "Marked. Describes management when paired with Windows Server"
    ),
    textAttr(
      "directory",
      "Domain or Microsoft Entra ID",
      SPEC,
      HOME,
      PRO,
      "Azure Active Directory Join, Hybrid Azure Active Directory Join, and Support for Active Directory are unmarked",
      "Those three rows are marked. Microsoft Support: join a domain or Microsoft Entra ID"
    ),
    textAttr(
      "memory",
      "Physical memory limit",
      SPEC,
      HOME,
      PRO,
      "128 GB on X64 and 128 GB on ARM64",
      "2 TB on X64 and 2 TB on ARM64"
    ),
    textAttr(
      "upgrade",
      "Home to Pro upgrade",
      SPEC,
      HOME,
      PRO,
      "Activated Home can move to Pro in the Microsoft Store or with a Pro product key under Settings > System > Activation",
      "Destination edition. Microsoft Support prompts an install of Windows 11 Pro and a restart"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "mac-vs-windows",
      title: "Mac vs Windows",
      category: "technology",
    },
    {
      slug: "mac-mini-m6-vs-windows-pc",
      title: "Mac mini M6 vs a Windows PC",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Home for a gaming PC that does not need Pro features. Pro for BitLocker management, Remote Desktop hosting, Hyper-V, Windows Sandbox, Group Policy, domain or Microsoft Entra ID join, or more than 128 GB of RAM.",
    keyFact:
      "Microsoft lists one Windows 11 hardware minimum for both editions, a 128 GB physical memory limit for Home, and a 2 TB physical memory limit for Pro.",
  },
  citationStats: {
    sourceCount: 9,
    dataPointCount: 11,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Microsoft — Windows 11 specifications", url: SPECS },
      { name: "Microsoft — Compare Windows 11 business editions", url: COMPARE },
      { name: "Microsoft Support — Device Encryption in Windows", url: DEVICE_ENCRYPTION },
      { name: "Microsoft Support — How to use Remote Desktop", url: REMOTE_DESKTOP },
      { name: "Microsoft Learn — Install Hyper-V", url: HYPER_V },
      { name: "Microsoft Learn — Windows Sandbox", url: SANDBOX },
      { name: "Microsoft Learn — Install Windows Sandbox", url: SANDBOX_INSTALL },
      { name: "Microsoft Learn — Memory limits for Windows releases", url: MEMORY },
      { name: "Microsoft Support — Upgrade Windows Home to Windows Pro", url: UPGRADE },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Windows 11 specifications",
      url: SPECS,
      description:
        "Minimum requirements for Windows 11. Home and Pro for personal use need internet and a Microsoft account during initial setup. BitLocker to Go and Client Hyper-V are available in Windows Pro and above editions.",
    },
    {
      type: "external",
      label: "Compare Windows 11 business editions",
      url: COMPARE,
      description:
        "Home, Pro, and Pro for Workstations. Device encryption is marked on Home and Pro. BitLocker device encryption, Remote desktop, Group Policy, and domain join are marked on Pro and unmarked on Home.",
    },
    {
      type: "external",
      label: "Device Encryption in Windows",
      url: DEVICE_ENCRYPTION,
      description:
        "Device Encryption is on a wider set of devices, including Windows Home. BitLocker Drive Encryption is on Pro, Enterprise, or Education. It can turn on with a Microsoft account.",
    },
    {
      type: "external",
      label: "How to use Remote Desktop",
      url: REMOTE_DESKTOP,
      description:
        "The remote PC must run a Pro edition. The client can run Home or Pro. Turn Remote Desktop on under Settings > System > Remote Desktop.",
    },
    {
      type: "external",
      label: "Install Hyper-V",
      url: HYPER_V,
      description:
        "Optional feature. Windows 11 Pro or Enterprise, SLAT, VM Monitor Mode Extension, 4 GB of memory. The role cannot be installed on Windows 11 Home.",
    },
    {
      type: "external",
      label: "Windows Sandbox",
      url: SANDBOX,
      description:
        "Windows Pro is marked Yes. Windows Sandbox is not supported on Windows Home.",
    },
    {
      type: "external",
      label: "Install Windows Sandbox",
      url: SANDBOX_INSTALL,
      description:
        "Turn it on under Turn Windows features on or off. Prerequisites include 4 GB of RAM, with 8 GB recommended.",
    },
    {
      type: "external",
      label: "Memory limits for Windows releases",
      url: MEMORY,
      description:
        "Windows 11 Home is 128 GB on X64 and ARM64. Windows 11 Pro is 2 TB on X64 and ARM64.",
    },
    {
      type: "external",
      label: "Upgrade Windows Home to Windows Pro",
      url: UPGRADE,
      description:
        "Microsoft Store, or a Pro product key under Settings > System > Activation. Steps apply to an activated copy of Home. Pro includes BitLocker, Remote Desktop, and domain or Microsoft Entra ID join.",
    },
  ],
  metaTitle: "Windows 11 Home vs Windows 11 Pro",
});
