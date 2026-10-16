import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: MySQL vs PostgreSQL (blog /blog/mysql-vs-postgresql-2026-which-database-should-developers-use).
 * Facts read 16 October 2026 from postgresql.org (about, licence, versioning
 * policy) and the MySQL 8.4 Reference Manual (what is MySQL, release tracks,
 * InnoDB). Licences, support windows and documented features only. No speed
 * claims, no third-party tests, no popularity rankings. No winner.
 */

const A = "mysql";
const B = "postgresql";

const MYSQL_WHAT = "https://dev.mysql.com/doc/refman/8.4/en/what-is-mysql.html";
const MYSQL_RELEASES = "https://dev.mysql.com/doc/refman/8.4/en/mysql-releases.html";
const MYSQL_INNODB = "https://dev.mysql.com/doc/refman/8.4/en/innodb-introduction.html";
const PG_ABOUT = "https://www.postgresql.org/about/";
const PG_LICENCE = "https://www.postgresql.org/about/licence/";
const PG_VERSIONING = "https://www.postgresql.org/support/versioning/";

const SOURCE_DATE = "2026-10-16";
const PUBLISHED = "2026-10-16T00:00:00Z";
const DB = "Database";

const SHORT_ANSWER =
  "MySQL and PostgreSQL are both open source relational databases with ACID transactions. The main differences are ownership and licence: Oracle develops MySQL under the GPL and sells commercial licences, while PostgreSQL is community-developed under the permissive PostgreSQL License. PostgreSQL is an object-relational system built for extensibility (PostGIS is a well-known add-on); MySQL pairs its server with the InnoDB engine and offers LTS and Innovation release tracks. Choose by licence needs, your team's experience and the features your app uses.";

const FAQS = [
  {
    question: "Is PostgreSQL better than MySQL?",
    answer:
      "Neither is better for every project. Both are relational, open source and support ACID transactions. PostgreSQL is object-relational and highly extensible; MySQL is developed by Oracle with LTS and Innovation release tracks. Test your own workload and pick what your team can run well.",
  },
  {
    question: "What licence do MySQL and PostgreSQL use?",
    answer:
      "MySQL uses the GNU General Public License, and Oracle sells a commercially licensed version for those who need to embed MySQL in a commercial application. PostgreSQL uses the PostgreSQL License, a liberal open source licence similar to BSD or MIT.",
  },
  {
    question: "How long is each version supported?",
    answer:
      "MySQL LTS series follow Oracle's Lifetime Support Policy: 5 years of premier support and 3 years of extended support. MySQL Innovation releases are supported until the next Innovation release. PostgreSQL supports each major version for about five years; PostgreSQL 18, first released September 25, 2025, has a final release date of November 14, 2030.",
  },
  {
    question: "Are both ACID compliant?",
    answer:
      "Yes. PostgreSQL has been ACID-compliant since 2001. In MySQL 8.4, the default InnoDB storage engine follows the ACID model with commit, rollback and crash recovery, row-level locking and foreign keys.",
  },
  {
    question: "Who develops MySQL and PostgreSQL?",
    answer:
      "Oracle Corporation develops, distributes and supports MySQL. PostgreSQL is developed by the PostgreSQL Global Development Group, an open source community; its origins date back to 1986.",
  },
  {
    question: "Can I move from MySQL to PostgreSQL later?",
    answer:
      "Yes, but plan for it: SQL dialects, data types and tooling differ, so schemas and queries usually need changes. Choosing based on the features you need now reduces later migration work.",
  },
];

const VERDICT = `Pick PostgreSQL if you want a permissive licence, a community-run project and an extensible object-relational database.

Pick MySQL if your stack or team already uses it, you want Oracle-backed LTS releases, or you may need a commercial licence.

Both are relational, open source and ACID-compliant. Test with your own data before deciding.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Both are open source relational databases with ACID transactions.
- MySQL is developed by Oracle under the GPL, with commercial licences available.
- PostgreSQL uses the PostgreSQL License, a liberal licence similar to BSD or MIT.
- MySQL LTS series get 5 years of premier and 3 years of extended support.
- PostgreSQL supports each major version for about five years.

Licence and ownership

MySQL is developed, distributed and supported by Oracle Corporation. Its software uses the GNU General Public License; teams that need to embed MySQL code in a commercial application can buy a commercially licensed version. PostgreSQL is released under the PostgreSQL License, which places few conditions on use, and is developed by the PostgreSQL Global Development Group.

Architecture and features

PostgreSQL describes itself as an object-relational database that uses and extends SQL, runs on all major operating systems and has add-ons such as PostGIS for geospatial data. MySQL's default storage engine in 8.4 is InnoDB, which provides ACID transactions, row-level locking, MVCC, foreign keys, full-text and geospatial indexes, and a 64TB storage limit.

Release and support model

1. MySQL LTS: stable features, fixes only, 5 years premier plus 3 years extended support. In-place upgrades within an LTS series.
2. MySQL Innovation: newest features, supported until the next Innovation release.
3. PostgreSQL: one major release a year, each supported for about five years. PostgreSQL 18 (September 25, 2025) is supported to November 14, 2030; PostgreSQL 14 reaches its final release on November 12, 2026.

Who should pick which

Pick by licence needs, team experience and required features, then run your own workload tests. AWS vs Azure and Docker vs Kubernetes cover related infrastructure choices.`;

const BUILT = buildEditorialComparison({
  slug: "mysql-vs-postgresql",
  title: "MySQL vs PostgreSQL: Licence, Support and Features",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "software",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "MySQL",
      shortDesc: "Open source relational database developed by Oracle under the GPL, with InnoDB as its default engine.",
      imageUrl: null,
      entityType: "software",
      position: 0,
      pros: [
        "LTS series with 5 years premier and 3 years extended support",
        "Commercial licence available from Oracle",
        "InnoDB: ACID, row-level locking, foreign keys",
      ],
      cons: ["GPL terms apply unless you buy a commercial licence", "Innovation releases are supported only until the next one"],
      bestFor: "Teams already on MySQL or wanting Oracle-backed LTS releases",
    },
    {
      id: B,
      slug: B,
      name: "PostgreSQL",
      shortDesc: "Community-developed open source object-relational database under the permissive PostgreSQL License.",
      imageUrl: null,
      entityType: "software",
      position: 1,
      pros: [
        "Permissive licence similar to BSD or MIT",
        "Extensible, with add-ons such as PostGIS",
        "ACID-compliant since 2001",
      ],
      cons: ["Each major version is supported for about five years, so upgrades are periodic", "No single vendor behind the project"],
      bestFor: "Teams wanting a permissive licence and an extensible database",
    },
  ],
  keyDifferences: [
    { label: "Licence", entityAValue: "GPL, plus commercial licences from Oracle", entityBValue: "PostgreSQL License (similar to BSD or MIT)", winner: "tie" },
    { label: "Developed by", entityAValue: "Oracle Corporation", entityBValue: "PostgreSQL Global Development Group", winner: "tie" },
    { label: "Support window", entityAValue: "LTS: 5 years premier + 3 years extended", entityBValue: "About five years per major version", winner: "tie" },
    { label: "Model", entityAValue: "Relational, InnoDB default engine", entityBValue: "Object-relational, extensible", winner: "tie" },
  ],
  attributes: [
    textAttr("licence", "Licence", DB, A, B, "GNU GPL; commercial licence available", "PostgreSQL License, a liberal open source licence"),
    textAttr("owner", "Developer", DB, A, B, "Oracle Corporation", "PostgreSQL Global Development Group"),
    textAttr("acid", "Transactions", DB, A, B, "ACID via InnoDB (commit, rollback, crash recovery)", "ACID-compliant since 2001"),
    textAttr("releases", "Release tracks", DB, A, B, "LTS and Innovation", "One major version a year, supported about five years"),
    textAttr("current", "Supported versions", DB, A, B, "8.4 LTS and 9.7 LTS series; Innovation releases", "14 to 18; 18 supported to November 14, 2030"),
    textAttr("engine", "Storage", DB, A, B, "InnoDB default; 64TB storage limit", "Extensible; add-ons such as PostGIS"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "aws-vs-azure", title: "AWS vs Azure", category: "software" },
    { slug: "docker-vs-kubernetes", title: "Docker vs Kubernetes", category: "software" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: "PostgreSQL for a permissive licence and extensibility; MySQL for Oracle-backed LTS releases and existing MySQL stacks.",
    keyFact: "MySQL uses the GPL with commercial licences from Oracle; PostgreSQL uses the permissive PostgreSQL License.",
  },
  citationStats: {
    sourceCount: 6,
    dataPointCount: 14,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "MySQL 8.4 Reference Manual: What is MySQL?", url: MYSQL_WHAT },
      { name: "MySQL 8.4 Reference Manual: Innovation and LTS releases", url: MYSQL_RELEASES },
      { name: "MySQL 8.4 Reference Manual: Introduction to InnoDB", url: MYSQL_INNODB },
      { name: "PostgreSQL: About", url: PG_ABOUT },
      { name: "PostgreSQL: Licence", url: PG_LICENCE },
      { name: "PostgreSQL: Versioning policy", url: PG_VERSIONING },
    ],
  },
  resources: [
    { type: "external", label: "MySQL 8.4 Reference Manual: What is MySQL?", url: MYSQL_WHAT, description: "Developed by Oracle; GPL with commercial licences available." },
    { type: "external", label: "MySQL 8.4 Reference Manual: Innovation and LTS releases", url: MYSQL_RELEASES, description: "LTS: 5 years premier and 3 years extended support. Innovation: supported until the next Innovation release." },
    { type: "external", label: "MySQL 8.4 Reference Manual: Introduction to InnoDB", url: MYSQL_INNODB, description: "InnoDB is the default engine in 8.4: ACID, row-level locking, MVCC, foreign keys, 64TB storage limit." },
    { type: "external", label: "PostgreSQL: About", url: PG_ABOUT, description: "Object-relational, origins in 1986, ACID-compliant since 2001, PostGIS add-on." },
    { type: "external", label: "PostgreSQL: Licence", url: PG_LICENCE, description: "PostgreSQL License, a liberal open source license similar to BSD or MIT." },
    { type: "external", label: "PostgreSQL: Versioning policy", url: PG_VERSIONING, description: "Supported versions 14 to 18; 18 first released September 25, 2025, final release November 14, 2030." },
  ],
  metaTitle: "MySQL vs PostgreSQL | A Versus B",
});

BUILT.metadata.metaDescription =
  "MySQL vs PostgreSQL: GPL vs permissive licence, Oracle vs community development, LTS and five-year support windows, InnoDB and extensibility compared.";

export const MYSQL_VS_POSTGRESQL: EditorialComparison = BUILT;
