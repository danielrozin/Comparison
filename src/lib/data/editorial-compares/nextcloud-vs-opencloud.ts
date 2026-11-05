import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-265 — Nextcloud vs OpenCloud for a self-hosted family drive.
 * Sources opened 5 November 2026 (Asia/Jerusalem).
 * Nextcloud server: github.com/nextcloud/server (PHP, AGPL-3.0, created 2016-06-02).
 * OpenCloud server: github.com/opencloud-eu/opencloud (Go, Apache-2.0, created 2025-01-10).
 * Fork, both project licenses, and free source: opencloud.eu community documentation.
 * Features, memory, database, Docker, and CalDAV: the admin docs linked below.
 * No winner. No prices. No speed benchmark.
 * Reddit returned HTTP 403, so there is no community block.
 */

const NEXTCLOUD = "nextcloud";
const OPENCLOUD = "opencloud";

const NC_SERVER = "https://github.com/nextcloud/server";
const OC_SERVER = "https://github.com/opencloud-eu/opencloud";
const OC_COMMUNITY = "https://opencloud.eu/en/opencloud-community";
const NC_REQUIREMENTS =
  "https://docs.nextcloud.com/server/latest/admin_manual/installation/system_requirements.html";
const OC_REQUIREMENTS = "https://docs.opencloud.eu/docs/admin/getting-started/requirements/";
const OC_FEATURES = "https://docs.opencloud.eu/docs/admin/features/";
const OC_RADICALE = "https://docs.opencloud.eu/docs/admin/configuration/radicale-integration/";
const OC_DOCKER = "https://docs.opencloud.eu/docs/admin/getting-started/container/docker/";
const OC_COMPOSE = "https://docs.opencloud.eu/docs/admin/getting-started/container/docker-compose/";
const NC_INSTALL = "https://nextcloud.com/install/";
const NC_AIO = "https://github.com/nextcloud/all-in-one";
const NC_OFFICE = "https://nextcloud.com/office/";
const NC_NOTES = "https://github.com/nextcloud/notes";
const NC_PRICING = "https://nextcloud.com/pricing/";
const NC_ENTERPRISE = "https://nextcloud.com/enterprise/";
const OC_PRICING = "https://opencloud.eu/en/subscription-support";

const SOURCE_DATE = "2026-11-05";
const PUBLISHED = "2026-11-05T00:00:00Z";
const SPEC = "Spec";

const SHORT_ANSWER =
  "OpenCloud is a Go file server (Apache-2.0). Nextcloud is a PHP server (AGPL-3.0) with an app store, mail, and calendar apps alongside files.";

const FAQS = [
  {
    question: "Is OpenCloud better than Nextcloud?",
    answer:
      "No single score says that. OpenCloud's server repository is a Go codebase for file management, sharing, and collaboration. Nextcloud's server README lists files, contacts, calendars, and more, and names an app store plus Mail and Video Chat. Use OpenCloud for that file server. Use Nextcloud when those apps are part of the same server project.",
  },
  {
    question: "Is OpenCloud a fork of Nextcloud?",
    answer:
      "No. OpenCloud states that the basis of the project is a fork of ownCloud Infinite Scale (OCIS). The nextcloud/server repository was created on 2 June 2016. Its README copyright line names ownCloud, Inc. for 2013-2016 and Nextcloud GmbH and contributors from 2016.",
  },
  {
    question: "Which is easier to maintain?",
    answer:
      "OpenCloud's requirements say the server has no database and stores files on storage. Nextcloud's admin manual documents PHP 8.3, 8.4, or 8.5, Apache or nginx, and a database such as MariaDB or PostgreSQL, plus apps. OpenCloud's documented server stack is narrower. That is not a measured maintenance score.",
  },
  {
    question: "Can I run Nextcloud or OpenCloud on a NAS with Docker?",
    answer:
      "Yes, when the NAS can run Docker. Nextcloud's install documentation points to the All-in-One Docker image that Nextcloud GmbH maintains. OpenCloud's container documentation shows a Docker setup and a Docker Compose setup. Follow those guides for the image, volumes, and URL. They do not add steps for a specific NAS brand.",
  },
  {
    question: "Are Nextcloud and OpenCloud free?",
    answer:
      "You can self-host both from public source code. OpenCloud states that you can download and use the source code free of charge and without obligation, and that OpenCloud GmbH also offers paid builds when you want support. Nextcloud server is under AGPL-3.0-or-later, and Nextcloud GmbH offers Nextcloud Enterprise. Plan names are on the Nextcloud pricing site and the OpenCloud subscription site. Amounts are not copied here.",
  },
  {
    question: "Can either replace Google Drive for a family?",
    answer:
      "Both document file sync, sharing, and desktop and mobile clients, so either can be the family's file drive. Nextcloud's README also lists contacts and calendars, and it names Mail and Video Chat. OpenCloud documents CalDAV and CardDAV calendars and contacts for external clients, and its Radicale guide says OpenCloud does not currently provide a UI for them. Google Drive vs OneDrive is a separate comparison.",
  },
];

const VERDICT = `File server: OpenCloud. Its server repository is Go, the README says it does not use a database, and its features documentation centers on sync, sharing, Spaces, and clients.

Apps on the same server: Nextcloud. The server README lists files, contacts, calendars, and more, and names Calendar, Contacts, Mail, Video Chat, and an app store. Nextcloud Office covers documents, spreadsheets, presentations, and PDFs in Nextcloud.

Calendars for a family: Nextcloud's Calendar and Contacts are apps in that project. OpenCloud documents CalDAV and CardDAV, names Apple Calendar, Outlook, Thunderbird, and Evolution, and its Radicale guide says there is no OpenCloud UI for them. That OpenCloud feature is outside the professional and premium subscription.

Neither server is the right pick for every family.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

The nextcloud/server repository is PHP. GitHub records it as created on 2 June 2016. The README license header is AGPL-3.0-or-later, and GitHub labels the repository AGPL-3.0. The README copyright line names Nextcloud GmbH and Nextcloud contributors from 2016 and ownCloud, Inc. from 2013-2016. The admin manual copyright line runs 2016-2026.

The opencloud-eu/opencloud repository is Go. GitHub records it as created on 10 January 2025. GitHub labels the repository Apache-2.0. The README says this is the OpenCloud server, that it contains the golang codebase for the backend services, and that the server is released under Apache 2.0. OpenCloud states that the project is a fork of ownCloud Infinite Scale (OCIS) and that the project is published under the Apache 2.0 and AGPL-3.0 licences.

OpenCloud states that you can download and use the source code free of charge and without obligation, and that paid builds exist when you want support. Nextcloud's pricing site names Standard, Premium, and Ultimate, and its open-source row says the AGPL license provides legal certainty for customers and users. Amounts stay on those sites.

What each product is

Nextcloud's server README calls it a safe home for all your data. It says you can store files, contacts, calendars, and more on a server you choose, sync them across devices, and share them. It says the server is expandable with hundreds of apps, and it names Calendar, Contacts, Mail, and Video Chat, plus the app store at apps.nextcloud.com. The Notes repository describes itself as distraction-free notes and writing. It is AGPL-3.0 and was created on 19 October 2016.

OpenCloud's repository description calls it an open source platform for file management, sharing, and collaboration. The README says the backend authenticates users with OpenID Connect, using an external identity provider such as Keycloak or the embedded LibreGraph Connect identity provider. It says the backend does not use a database and stores all data in the filesystem. By default the root directory is $HOME/.opencloud/.

Feature scope

Both products document files, sync, and sharing.

Nextcloud's README is the groupware list: files, contacts, calendars, Mail, Video Chat, and the app store. Nextcloud Office is described as private collaboration on documents, spreadsheets, presentations, and PDFs inside Nextcloud. The Office site names Collabora Online.

OpenCloud's features documentation covers sync across devices, sharing with roles, expiration, and password protection, Spaces as team folders, and clients for Windows, Mac, Linux, Android, iOS, and the web. Files On-Demand is described for Windows desktop and for mobile clients. It says there is no system-side limit on the number or size of stored files, and that capacity depends on the server or storage you deploy. Administrators can set quotas. External sharing is described with password-protected links. Guest accounts are marked soon.

OpenCloud's web office section says Collabora Online opens office documents in the browser, with comments, real-time co-editing, and compatibility with Microsoft Office and OpenDocument formats. Its calendar and contacts section says CalDAV and CardDAV integration is for shared calendars and contacts, names Apple Calendar, Outlook, Thunderbird, and Evolution, and says this feature is not supported in the professional or premium subscription. The Radicale guide says OpenCloud can proxy authenticated CalDAV and CardDAV to Radicale, that OpenCloud does not currently provide a UI for calendar and contacts, that this needs OpenCloud 2.3.0 or later, and that the feature is best effort, without warranty, and not covered by the professional or premium license.

OpenCloud's features documentation also marks items such as virus scanning, watermarks, and Active Directory as part of the professional or premium subscription. Those are not treated here as part of every self-hosted install. Its zero-knowledge section says administrators can manage Spaces, including cleanup and quota changes, but cannot access the content.

OpenCloud describes the interface as fast and responsive in folders with many files. That is OpenCloud's description. Neither of these documentations gives a timed comparison of the two servers.

Architecture and upkeep

Nextcloud's admin manual recommends a 64-bit CPU, OS, and PHP. It lists PHP 8.3, 8.4, and 8.5, with 8.5 recommended. It lists Apache 2.4 with mod_php or php-fpm, and nginx with php-fpm. Databases it names are MySQL 8.4 or 9.7, MariaDB (recommended), PostgreSQL (recommended), Oracle Database only as part of an enterprise subscription, and SQLite only for testing and minimal instances. It says Nextcloud needs a minimum of 128 MB RAM per process, recommends a minimum of 512 MB RAM per process, and says the built-in Updater needs at least 256 MB. It says memory needs vary with users, apps, files, and activity. It says old PHP versions are dropped over time.

OpenCloud's requirements say production runs on Linux, and that MacOS or Windows WSL are for testing and development. The database row says none, because OpenCloud stores files on storage. The minimum hardware example, labeled for a minimal bare-metal deployment of up to 10 users, is a Raspberry Pi 3 class machine, 1 GHz single-core, and 512 MB RAM, with storage depending on data. The medium example, labeled for up to 1,000 users, is 2 GHz dual-core and 8 GB RAM. The same section says requirements vary with requests, client devices, file volume, post-processing, and extra apps such as Collabora. Those two memory figures are different kinds of numbers: Nextcloud's are per PHP process, and OpenCloud's are example machine sizes. They are not a benchmark.

A narrower documented stack is the maintenance difference: Go, filesystem storage, and no database on the OpenCloud server, versus PHP, a web server, a database, and apps on Nextcloud. Optional OpenCloud containers, including Collabora and Radicale, are still extra pieces when you turn them on.

Setup on Docker, including a NAS

Nextcloud's install documentation describes an All-in-One Docker image for home or cloud, maintained by Nextcloud GmbH. The all-in-one repository calls itself the official Nextcloud installation method and says it provides deployment and maintenance with most features in one Nextcloud instance. Use that repository and the install documentation for the image and volumes.

OpenCloud's Docker guide is for a local instance. It lists Linux, Mac, or Windows Subsystem for Linux, tells you to create config and data directories, and pulls opencloudeu/opencloud-rolling. The sample run publishes port 9200. A separate Docker Compose guide covers Traefik or an external proxy. Use those guides rather than a one-off NAS recipe.

A NAS can run either server when that NAS runs Docker and a Linux-style container. OpenCloud's requirements describe production as Linux, from a Raspberry Pi to a data center. Neither guide adds steps for one NAS brand.

Desktop and phone clients are documented for both. Nextcloud's admin manual recommends Windows 10 or later, macOS Monterey (12.0) or later, and 64-bit Linux for the desktop client, and iOS 17.0 or later and Android 9.0 or later for the Files app. OpenCloud's features documentation names Windows, Mac, Linux, Android, iOS, and the web, and does not give those minimum OS numbers.

Family use

Nextcloud's README is the family feature list: each person can have files, contacts, and calendars on the server, synced to their devices, with sharing for the people you choose. Mail, Video Chat, and Notes are separate apps in the Nextcloud project. Nextcloud Office is the in-browser document editor described above.

OpenCloud's features documentation gives each user a personal storage area, Spaces for a shared family or project folder, internal sharing with rights such as read, edit, or upload, and external links with passwords. It says a client can hold multiple accounts. Calendar and contacts, when you enable the documented CalDAV and CardDAV path, are for external clients such as Apple Calendar, Outlook, Thunderbird, and Evolution, not an OpenCloud calendar screen. The Radicale guide says OpenCloud does not currently provide that UI.

Who should pick which

Choose OpenCloud when the job is file sync and sharing, you want the Go server that stores data on the filesystem, and calendar or office can be the documented add-ons (Collabora, and CalDAV or CardDAV without an OpenCloud UI).

Choose Nextcloud when the same server should also run Nextcloud's calendar and contacts apps, Mail, Video Chat, Notes, and other apps from the app store, with Nextcloud Office for documents in the browser.

Moving a family off Google Drive or OneDrive is a different decision from which of these servers you install. Google Drive vs OneDrive is at /compare/google-drive-vs-onedrive. Google Drive alternatives are at /alternatives/google-drive.`;

export const NEXTCLOUD_VS_OPENCLOUD: EditorialComparison = buildEditorialComparison({
  slug: "nextcloud-vs-opencloud",
  title: "Nextcloud vs OpenCloud for a Self-Hosted Drive",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "software",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: NEXTCLOUD,
      slug: NEXTCLOUD,
      name: "Nextcloud",
      shortDesc:
        "A PHP server under AGPL-3.0 for files, calendars, contacts, mail, and an app store.",
      imageUrl: null,
      entityType: "software",
      position: 0,
      pros: [
        "Server README lists files, contacts, calendars, and more, plus an app store",
        "README names Calendar, Contacts, Mail, and Video Chat",
        "Nextcloud Office covers documents, spreadsheets, presentations, and PDFs",
        "All-in-One Docker image maintained by Nextcloud GmbH",
      ],
      cons: [
        "Admin manual documents PHP, Apache or nginx, and a database",
        "Minimum 128 MB RAM per process, 512 MB recommended per process, 256 MB for the updater",
        "PHP versions in the manual are 8.3, 8.4, and 8.5, and old PHP versions are dropped over time",
        "Enterprise plan amounts are on the pricing site and are not copied here",
      ],
      bestFor: "Files plus calendar apps, mail, and an app store on one server",
    },
    {
      id: OPENCLOUD,
      slug: OPENCLOUD,
      name: "OpenCloud",
      shortDesc:
        "A Go file server under Apache-2.0 for sync, sharing, and collaboration, forked from ownCloud Infinite Scale.",
      imageUrl: null,
      entityType: "software",
      position: 1,
      pros: [
        "Go server repository under Apache-2.0, created 10 January 2025",
        "README says there is no database and data is stored on the filesystem",
        "Features documentation covers sync, sharing, Spaces, and desktop and mobile clients",
        "Source code is free of charge. Docker and Docker Compose guides are published",
      ],
      cons: [
        "Community documentation says the project is a fork of ownCloud Infinite Scale and is published under Apache 2.0 and AGPL-3.0",
        "Radicale guide says there is no OpenCloud UI for calendar and contacts",
        "Calendar and contacts, and several other features, sit outside the professional and premium subscription",
        "Minimum example is 512 MB RAM and 1 GHz for up to 10 users, and sizing still depends on load and apps such as Collabora",
      ],
      bestFor: "A Go file server for sync, sharing, and Spaces",
    },
  ],
  keyDifferences: [
    {
      label: "Server language",
      entityAValue: "PHP",
      entityBValue: "Go",
      winner: "tie",
    },
    {
      label: "Server repository license",
      entityAValue: "AGPL-3.0-or-later",
      entityBValue: "Apache-2.0",
      winner: "tie",
    },
    {
      label: "Repository created",
      entityAValue: "2 June 2016",
      entityBValue: "10 January 2025",
      winner: "tie",
    },
    {
      label: "Database",
      entityAValue: "MariaDB, MySQL, PostgreSQL, or SQLite for tests",
      entityBValue: "None. Files stored on storage",
      winner: "tie",
    },
    {
      label: "Files, sync, and sharing",
      entityAValue: "In the server README",
      entityBValue: "In the features documentation",
      winner: "tie",
    },
    {
      label: "Web office",
      entityAValue: "Nextcloud Office, Collabora Online named",
      entityBValue: "Collabora Online in the browser",
      winner: "tie",
    },
    {
      label: "Calendar and contacts",
      entityAValue: "Calendar and Contacts apps",
      entityBValue: "CalDAV and CardDAV. No OpenCloud UI in the Radicale guide",
      winner: "tie",
    },
    {
      label: "Mail and video chat",
      entityAValue: "Mail and Video Chat named in the README",
      entityBValue: "Email notifications for shares. No mail app named",
      winner: "tie",
    },
    {
      label: "App catalog",
      entityAValue: "App store, hundreds of apps in the README",
      entityBValue: "Plugin architecture and documented integrations",
      winner: "tie",
    },
    {
      label: "Self-host cost",
      entityAValue: "Public source. Enterprise plans priced on the site",
      entityBValue: "Source free of charge. Paid builds and subscriptions exist",
      winner: "tie",
    },
    {
      label: "Documented memory figure",
      entityAValue: "128 MB RAM minimum per process",
      entityBValue: "512 MB RAM in the up-to-10-users example",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "language",
      "Server language",
      SPEC,
      NEXTCLOUD,
      OPENCLOUD,
      "PHP",
      "Go. The README calls the backend a golang codebase"
    ),
    textAttr(
      "created",
      "Repository created",
      SPEC,
      NEXTCLOUD,
      OPENCLOUD,
      "2 June 2016. README copyright names ownCloud, Inc. for 2013-2016",
      "10 January 2025. Described as a fork of ownCloud Infinite Scale (OCIS)"
    ),
    textAttr(
      "license",
      "Server repository license",
      SPEC,
      NEXTCLOUD,
      OPENCLOUD,
      "AGPL-3.0-or-later in the README header. GitHub label AGPL-3.0",
      "Apache-2.0. README says the server is released under Apache 2.0. Community documentation also names AGPL-3.0 for the project"
    ),
    textAttr(
      "database",
      "Database",
      SPEC,
      NEXTCLOUD,
      OPENCLOUD,
      "MySQL 8.4 or 9.7, MariaDB (recommended), PostgreSQL (recommended), Oracle on enterprise, SQLite for testing and minimal instances",
      "None. Files are stored on storage. Default data root in the README is $HOME/.opencloud/"
    ),
    textAttr(
      "runtime",
      "Web stack",
      SPEC,
      NEXTCLOUD,
      OPENCLOUD,
      "PHP 8.3, 8.4, or 8.5 (8.5 recommended). Apache 2.4 or nginx. 64-bit CPU, OS, and PHP recommended",
      "Go server. Production OS is Linux. MacOS or Windows WSL are for testing and development. OpenID Connect with Keycloak or LibreGraph Connect"
    ),
    textAttr(
      "files",
      "Files, sync, and sharing",
      SPEC,
      NEXTCLOUD,
      OPENCLOUD,
      "Store, sync, and share files, contacts, calendars, and more",
      "Sync, sharing with roles, expiration, and passwords, Spaces, and personal storage. No system-side file size cap. Capacity follows the disk you provide"
    ),
    textAttr(
      "office",
      "Web office",
      SPEC,
      NEXTCLOUD,
      OPENCLOUD,
      "Documents, spreadsheets, presentations, and PDFs in Nextcloud. Collabora Online is named",
      "Collabora Online in the browser, including Microsoft Office and OpenDocument formats"
    ),
    textAttr(
      "groupware",
      "Calendar, contacts, mail",
      SPEC,
      NEXTCLOUD,
      OPENCLOUD,
      "Calendar and Contacts apps. README also names Mail and Video Chat. Notes is a separate AGPL-3.0 app",
      "CalDAV and CardDAV for external clients. Radicale guide: no OpenCloud UI, version 2.3.0 or later, not in professional or premium support. Email notifications for shares"
    ),
    textAttr(
      "clients",
      "Clients",
      SPEC,
      NEXTCLOUD,
      OPENCLOUD,
      "Desktop: Windows 10+, macOS Monterey 12+, 64-bit Linux. Files app: iOS 17+, Android 9+",
      "Windows, Mac, Linux, Android, iOS, and web. Minimum OS versions are not in the features documentation"
    ),
    textAttr(
      "memory",
      "Documented memory",
      SPEC,
      NEXTCLOUD,
      OPENCLOUD,
      "128 MB RAM minimum per process. 512 MB RAM recommended per process. Updater needs at least 256 MB",
      "Minimum example, up to 10 users: 1 GHz single-core, 512 MB RAM. Medium example, up to 1,000 users: 2 GHz dual-core, 8 GB RAM. Varies with load and apps such as Collabora"
    ),
    textAttr(
      "docker",
      "Docker install",
      SPEC,
      NEXTCLOUD,
      OPENCLOUD,
      "All-in-One Docker image for home or cloud, maintained by Nextcloud GmbH",
      "Docker guide pulls opencloudeu/opencloud-rolling and publishes port 9200. Docker Compose guide covers Traefik or an external proxy"
    ),
    textAttr(
      "cost",
      "Price",
      SPEC,
      NEXTCLOUD,
      OPENCLOUD,
      "Public source under AGPL. Pricing site lists Standard, Premium, and Ultimate. Amounts are not copied here",
      "Source free of charge. Paid builds exist. Subscription site lists Basic, Professional, and Premium, plus a Community Edition on GitHub. Amounts are not copied here"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "google-drive-vs-onedrive",
      title: "Google Drive vs OneDrive",
      category: "software",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "OpenCloud for the Go file server with sync and sharing. Nextcloud when calendar apps, mail, and the app store are part of the same server.",
    keyFact:
      "Nextcloud server is PHP and AGPL-3.0, repository created 2 June 2016. OpenCloud server is Go and Apache-2.0, repository created 10 January 2025, and OpenCloud states it is a fork of ownCloud Infinite Scale.",
  },
  citationStats: {
    sourceCount: 16,
    dataPointCount: 12,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Nextcloud — server repository", url: NC_SERVER },
      { name: "OpenCloud — server repository", url: OC_SERVER },
      { name: "OpenCloud — community", url: OC_COMMUNITY },
      { name: "Nextcloud admin manual — system requirements", url: NC_REQUIREMENTS },
      { name: "OpenCloud docs — requirements", url: OC_REQUIREMENTS },
      { name: "OpenCloud docs — features", url: OC_FEATURES },
      { name: "OpenCloud docs — calendar and contacts with Radicale", url: OC_RADICALE },
      { name: "OpenCloud docs — Docker", url: OC_DOCKER },
      { name: "OpenCloud docs — Docker Compose", url: OC_COMPOSE },
      { name: "Nextcloud — install", url: NC_INSTALL },
      { name: "Nextcloud — All-in-One", url: NC_AIO },
      { name: "Nextcloud Office", url: NC_OFFICE },
      { name: "Nextcloud — Notes", url: NC_NOTES },
      { name: "Nextcloud — pricing", url: NC_PRICING },
      { name: "Nextcloud Enterprise", url: NC_ENTERPRISE },
      { name: "OpenCloud — subscription and support", url: OC_PRICING },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Nextcloud server repository",
      url: NC_SERVER,
      description:
        "PHP server. README header is AGPL-3.0-or-later. Created 2 June 2016. Lists files, contacts, calendars, Mail, Video Chat, and the app store. Copyright line names ownCloud, Inc. for 2013-2016.",
    },
    {
      type: "external",
      label: "OpenCloud server repository",
      url: OC_SERVER,
      description:
        "Go server. Apache-2.0. Created 10 January 2025. README says the backend is golang, uses OpenID Connect, does not use a database, and stores data on the filesystem.",
    },
    {
      type: "external",
      label: "OpenCloud community",
      url: OC_COMMUNITY,
      description:
        "Fork of ownCloud Infinite Scale (OCIS). Project published under Apache 2.0 and AGPL-3.0. Source code is free of charge. Paid builds exist for support.",
    },
    {
      type: "external",
      label: "Nextcloud system requirements",
      url: NC_REQUIREMENTS,
      description:
        "PHP 8.3, 8.4, or 8.5. Apache or nginx. Database options. 128 MB RAM minimum per process, 512 MB recommended per process, 256 MB for the updater. Desktop and Files app OS versions.",
    },
    {
      type: "external",
      label: "OpenCloud requirements",
      url: OC_REQUIREMENTS,
      description:
        "Production on Linux. No database. Minimum example up to 10 users: 1 GHz and 512 MB RAM. Medium example up to 1,000 users: 2 GHz and 8 GB RAM. Sizing varies, including with Collabora.",
    },
    {
      type: "external",
      label: "OpenCloud features",
      url: OC_FEATURES,
      description:
        "Sync, sharing, Spaces, clients, Collabora web office, and CalDAV and CardDAV. Some items are marked professional or premium. Zero-knowledge wording for Space content.",
    },
    {
      type: "external",
      label: "OpenCloud calendar and contacts with Radicale",
      url: OC_RADICALE,
      description:
        "Authenticating reverse proxy to Radicale. No OpenCloud UI for calendar and contacts. Needs OpenCloud 2.3.0 or later. Best effort, and not in the professional or premium license.",
    },
    {
      type: "external",
      label: "OpenCloud Docker",
      url: OC_DOCKER,
      description:
        "Local Docker setup. Linux, Mac, or WSL. Image opencloudeu/opencloud-rolling. Sample run publishes port 9200.",
    },
    {
      type: "external",
      label: "OpenCloud Docker Compose",
      url: OC_COMPOSE,
      description: "Docker Compose with Traefik or an external proxy.",
    },
    {
      type: "external",
      label: "Install Nextcloud",
      url: NC_INSTALL,
      description:
        "All-in-One Docker image for home or cloud. Nextcloud GmbH maintains it.",
    },
    {
      type: "external",
      label: "Nextcloud All-in-One",
      url: NC_AIO,
      description:
        "Official Nextcloud installation method. Deployment and maintenance with most features in one instance.",
    },
    {
      type: "external",
      label: "Nextcloud Office",
      url: NC_OFFICE,
      description:
        "Collaboration on documents, spreadsheets, presentations, and PDFs in Nextcloud. Names Collabora Online.",
    },
    {
      type: "external",
      label: "Nextcloud Notes",
      url: NC_NOTES,
      description: "Distraction-free notes and writing. AGPL-3.0. Repository created 19 October 2016.",
    },
    {
      type: "external",
      label: "Nextcloud pricing",
      url: NC_PRICING,
      description:
        "Standard, Premium, and Ultimate. AGPL row says the license provides legal certainty. Amounts are not copied here.",
    },
    {
      type: "external",
      label: "Nextcloud Enterprise",
      url: NC_ENTERPRISE,
      description: "Nextcloud Enterprise from Nextcloud GmbH, linked from the server README.",
    },
    {
      type: "external",
      label: "OpenCloud subscription and support",
      url: OC_PRICING,
      description:
        "Basic, Professional, and Premium. Community Edition is the self-hosted version on GitHub. Amounts are not copied here.",
    },
  ],
  metaTitle: "Nextcloud vs OpenCloud",
});
