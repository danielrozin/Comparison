import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: Amazon Aurora vs MySQL.
 * AWS Aurora product page and Aurora user guide; MySQL 8.4 reference manual. No throughput claims.
 * Facts read 16 October 2026 from official sources only. No winner.
 */

const PUBLISHED = "2026-10-16T00:00:00Z";
const SHORT_ANSWER = "Amazon Aurora is a fully managed AWS database engine compatible with MySQL and PostgreSQL: AWS handles provisioning, patching, backup and failure detection, storage grows automatically to 256 TiB per cluster volume, and it is designed for up to 99.99% single-Region availability. MySQL is the open source database developed by Oracle under the GPL, free to download and run on any machine or cloud, with a commercial license available. Choose Aurora for a managed database on AWS; choose MySQL to run it yourself anywhere.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Aurora is a managed AWS service; MySQL is software you install and run.
- Aurora is compatible with MySQL and PostgreSQL; existing code, tools and apps work with it.
- Aurora storage grows automatically, up to 256 TiB per cluster volume.
- Aurora is designed for up to 99.99% single-Region and 99.999% multi-Region availability.
- MySQL is open source under the GPL, with a commercial license from Oracle.

Management

Aurora is part of Amazon RDS. AWS handles provisioning, patching, backup, recovery, failure detection and repair, and automates clustering and replication. You remain responsible for query tuning. With MySQL you install the server and manage scaling, backups and replication yourself, or use a managed service.

Compatibility and migration

You choose Aurora MySQL or Aurora PostgreSQL when you create a cluster. Data from RDS for MySQL can move into Aurora through snapshots or replication, and standard tools migrate MySQL databases to and from Aurora.

Licensing and where it runs

1. MySQL can be downloaded and used without paying, under the GPL; a commercial license is available for embedding in commercial apps.
2. Aurora runs only on AWS and is billed per instance and storage.
3. MySQL runs on a desktop, a server, a cluster or any cloud.

Who should pick which

Pick Aurora if you are on AWS and want a managed, highly available MySQL-compatible database. Pick MySQL if you want to run the database yourself, on any infrastructure, at no license cost. MySQL vs PostgreSQL covers the engine choice.`;

const BUILT = buildEditorialComparison({
  slug: "amazon-aurora-vs-mysql",
  title: "Amazon Aurora vs MySQL: Managed vs Open Source",
  shortAnswer: SHORT_ANSWER,
  verdict: "Amazon Aurora: managed on AWS, MySQL- and PostgreSQL-compatible, storage to 256 TiB.\n\nMySQL: open source under the GPL, runs anywhere, you manage it.\n\nCompare AWS costs with self-hosting for your workload.",
  category: "software",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {"id": "amazon-aurora", "slug": "amazon-aurora", "name": "Amazon Aurora", "shortDesc": "Fully managed AWS relational database compatible with MySQL and PostgreSQL.", "imageUrl": null, "entityType": "software", "position": 0, "pros": ["Compatible with MySQL and PostgreSQL code, tools and apps", "Storage grows automatically up to 256 TiB per cluster volume", "Designed for up to 99.99% single-Region and 99.999% multi-Region availability"], "cons": ["Runs only on AWS", "You pay for instances, storage and I/O on AWS"], "bestFor": "Teams on AWS that want a managed MySQL- or PostgreSQL-compatible database"},
    {"id": "mysql", "slug": "mysql", "name": "MySQL", "shortDesc": "Open source relational database developed by Oracle, licensed under the GPL.", "imageUrl": null, "entityType": "software", "position": 1, "pros": ["Free to download and use under the GPL", "Runs anywhere: laptop, server or any cloud", "Commercial license available from Oracle"], "cons": ["You manage installation, scaling, backups and failover yourself", "Embedding in commercial apps may need a commercial license"], "bestFor": "Teams that want to run their own database on any infrastructure"},
  ],
  keyDifferences: [{"label": "Type", "entityAValue": "Managed AWS service", "entityBValue": "Open source software", "winner": "tie"}, {"label": "Compatibility", "entityAValue": "MySQL and PostgreSQL", "entityBValue": "MySQL", "winner": "tie"}, {"label": "License", "entityAValue": "AWS service terms", "entityBValue": "GPL, or commercial license", "winner": "tie"}, {"label": "Where it runs", "entityAValue": "AWS only", "entityBValue": "Anywhere", "winner": "tie"}],
  attributes: [
    textAttr("a0", "Developer", "Databases", "amazon-aurora", "mysql", "Amazon Web Services", "Oracle Corporation"),
    textAttr("a1", "Storage", "Databases", "amazon-aurora", "mysql", "Auto-grows to 256 TiB per cluster volume", "Depends on your hardware"),
    textAttr("a2", "Availability design", "Databases", "amazon-aurora", "mysql", "Up to 99.99% single-Region, 99.999% multi-Region", "Depends on your setup"),
    textAttr("a3", "Operations", "Databases", "amazon-aurora", "mysql", "AWS handles patching, backup, failure detection", "You or your host handle them"),
    textAttr("a4", "Cost model", "Databases", "amazon-aurora", "mysql", "Pay for AWS usage", "Free under GPL; commercial license optional"),
  ],
  faqs: [{"question": "Is Amazon Aurora the same as MySQL?", "answer": "No. Aurora is a separate AWS database engine that is compatible with MySQL and PostgreSQL, so MySQL code, tools and apps work with it."}, {"question": "Is MySQL free?", "answer": "Yes. MySQL is open source under the GPL and can be downloaded and used without paying. Oracle sells a commercial license for cases such as embedding MySQL in commercial applications."}, {"question": "How large can an Aurora database get?", "answer": "An Aurora cluster volume grows automatically up to 256 tebibytes (TiB)."}, {"question": "Can I move from MySQL to Aurora?", "answer": "Yes. You can migrate MySQL databases to and from Aurora with standard tools, and bring RDS for MySQL data in through snapshots or replication."}, {"question": "Can Aurora run outside AWS?", "answer": "No. Aurora is an AWS service. MySQL can run on your own hardware or any cloud."}, {"question": "Who manages backups and patching?", "answer": "For Aurora, AWS handles provisioning, patching, backup, recovery and failure detection; you handle query tuning. For self-run MySQL, you manage them."}],
  relatedComparisons: [{"slug": "mysql-vs-postgresql", "title": "MySQL vs PostgreSQL", "category": "software"}],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: { tldr: SHORT_ANSWER, winnerName: null, winnerReason: "Aurora for a managed MySQL-compatible database on AWS; MySQL to self-host anywhere under the GPL.", keyFact: "Aurora storage grows to 256 TiB per cluster volume; MySQL is open source under the GPL." },
  citationStats: {"sourceCount": 3, "dataPointCount": 12, "reviewsAnalyzed": null, "preferencePercent": null, "preferenceEntity": null, "lastResearched": "2026-10-16", "sources": [{"name": "AWS: Amazon Aurora", "url": "https://aws.amazon.com/rds/aurora/"}, {"name": "AWS: What is Amazon Aurora?", "url": "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html"}, {"name": "MySQL 8.4 Reference Manual: What is MySQL?", "url": "https://dev.mysql.com/doc/refman/8.4/en/what-is-mysql.html"}]},
  resources: [{"type": "external", "label": "AWS: Amazon Aurora", "url": "https://aws.amazon.com/rds/aurora/", "description": "Compatible with PostgreSQL and MySQL; designed for 99.99% single-Region and 99.999% multi-Region availability."}, {"type": "external", "label": "AWS: What is Amazon Aurora?", "url": "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html", "description": "Managed engine; storage to 256 TiB; part of Amazon RDS; shared responsibility model."}, {"type": "external", "label": "MySQL 8.4 Reference Manual: What is MySQL?", "url": "https://dev.mysql.com/doc/refman/8.4/en/what-is-mysql.html", "description": "Open source under the GPL; developed by Oracle; commercial license available."}],
  metaTitle: "Amazon Aurora vs MySQL | A Versus B",
});

BUILT.metadata.metaDescription = "Amazon Aurora vs MySQL: managed AWS engine vs open source GPL database. Compatibility, storage to 256 TiB, availability design, licensing and migration.";

export const AMAZON_AURORA_VS_MYSQL: EditorialComparison = BUILT;
