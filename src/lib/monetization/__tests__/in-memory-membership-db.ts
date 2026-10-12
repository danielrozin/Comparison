/**
 * In-memory stand-in for the Pro membership tables. Tests point
 * `getPrisma` at `getMembershipTestPrisma()` so access checks run without
 * Redis and without a real database.
 */

import { AsyncLocalStorage } from "node:async_hooks";

interface MemberRow {
  id: string;
  email: string;
  plan: string;
  interval: string;
  status: string;
  src: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  currentPeriodEnd: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UsageRow {
  id: string;
  email: string;
  month: string;
  pairKeys: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface EventRow {
  id: string;
  type: string;
  createdAt: Date;
}

interface BillingTokenRow {
  tokenHash: string;
  email: string;
  stripeCustomerId: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
}

function uniqueError(): Error {
  const err = new Error("Unique constraint failed");
  (err as Error & { code: string }).code = "P2002";
  return err;
}

function createDb() {
  const members: MemberRow[] = [];
  const usage: UsageRow[] = [];
  const events: EventRow[] = [];
  const billingTokens: BillingTokenRow[] = [];
  const emailLockTails = new Map<string, Promise<void>>();
  const txStorage = new AsyncLocalStorage<{ releases: Array<() => void> }>();
  let seq = 0;
  const state = { enabled: true, failWrites: false, failBillingLock: "" };

  function acquireEmailLock(email: string): Promise<() => void> {
    const previous = emailLockTails.get(email) ?? Promise.resolve();
    let release!: () => void;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    emailLockTails.set(email, previous.then(() => held));
    return previous.then(() => release);
  }

  function nextId(prefix: string) {
    seq += 1;
    return `${prefix}_${seq}`;
  }

  function assertMemberUnique(row: MemberRow, ignoreId?: string) {
    for (const other of members) {
      if (other.id === ignoreId) continue;
      if (other.email === row.email) throw uniqueError();
      if (row.stripeCustomerId && other.stripeCustomerId === row.stripeCustomerId) throw uniqueError();
      if (row.stripeSubscriptionId && other.stripeSubscriptionId === row.stripeSubscriptionId) {
        throw uniqueError();
      }
    }
  }

  function requireWrites() {
    if (state.failWrites) throw new Error("forced membership persist failure");
  }

  const client = {
    proMember: {
      async findUnique({ where }: { where: { id?: string; email?: string; stripeCustomerId?: string; stripeSubscriptionId?: string } }) {
        const found = members.find((row) => {
          if (where.id) return row.id === where.id;
          if (where.email) return row.email === where.email;
          if (where.stripeSubscriptionId) return row.stripeSubscriptionId === where.stripeSubscriptionId;
          if (where.stripeCustomerId) return row.stripeCustomerId === where.stripeCustomerId;
          return false;
        });
        return found ? { ...found } : null;
      },
      async create({ data }: { data: Partial<MemberRow> & { email: string } }) {
        requireWrites();
        const now = new Date();
        const row: MemberRow = {
          id: nextId("mem"),
          email: data.email,
          plan: data.plan ?? "",
          interval: data.interval ?? "",
          status: data.status ?? "active",
          src: data.src ?? "",
          stripeCustomerId: data.stripeCustomerId ?? null,
          stripeSubscriptionId: data.stripeSubscriptionId ?? null,
          currentPeriodEnd: data.currentPeriodEnd ?? null,
          createdAt: now,
          updatedAt: data.updatedAt ?? now,
        };
        assertMemberUnique(row);
        members.push(row);
        return { ...row };
      },
      async update({ where, data }: { where: { id: string }; data: Partial<MemberRow> }) {
        requireWrites();
        const row = members.find((item) => item.id === where.id);
        if (!row) throw new Error("record not found");
        const next = { ...row, ...data, updatedAt: data.updatedAt ?? new Date() };
        assertMemberUnique(next, row.id);
        Object.assign(row, next);
        return { ...row };
      },
    },
    processedStripeEvent: {
      async create({ data }: { data: { id: string; type: string } }) {
        if (events.some((event) => event.id === data.id)) throw uniqueError();
        const row = { id: data.id, type: data.type, createdAt: new Date() };
        events.push(row);
        return { ...row };
      },
    },
    proCustomCompareUsage: {
      async findUnique({
        where,
      }: {
        where: { id?: string; email_month?: { email: string; month: string } };
      }) {
        const found = usage.find((row) => {
          if (where.id) return row.id === where.id;
          if (where.email_month) {
            return row.email === where.email_month.email && row.month === where.email_month.month;
          }
          return false;
        });
        return found ? { ...found, pairKeys: [...found.pairKeys] } : null;
      },
      async create({ data }: { data: { email: string; month: string; pairKeys: string[] } }) {
        if (usage.some((row) => row.email === data.email && row.month === data.month)) throw uniqueError();
        const now = new Date();
        const row: UsageRow = {
          id: nextId("use"),
          email: data.email,
          month: data.month,
          pairKeys: [...data.pairKeys],
          createdAt: now,
          updatedAt: now,
        };
        usage.push(row);
        return { ...row, pairKeys: [...row.pairKeys] };
      },
      async update({
        where,
        data,
      }: {
        where: { id?: string; email_month?: { email: string; month: string } };
        data: { pairKeys: string[] };
      }) {
        const row = usage.find((item) => {
          if (where.id) return item.id === where.id;
          if (where.email_month) {
            return item.email === where.email_month.email && item.month === where.email_month.month;
          }
          return false;
        });
        if (!row) throw new Error("record not found");
        row.pairKeys = [...data.pairKeys];
        row.updatedAt = new Date();
        return { ...row, pairKeys: [...row.pairKeys] };
      },
    },
    billingPortalToken: {
      async create({
        data,
      }: {
        data: {
          tokenHash: string;
          email: string;
          stripeCustomerId: string;
          expiresAt: Date;
        };
      }) {
        if (billingTokens.some((row) => row.tokenHash === data.tokenHash)) throw uniqueError();
        const row: BillingTokenRow = {
          tokenHash: data.tokenHash,
          email: data.email,
          stripeCustomerId: data.stripeCustomerId,
          expiresAt: data.expiresAt,
          usedAt: null,
          createdAt: new Date(),
        };
        billingTokens.push(row);
        return { ...row };
      },
      async count({
        where,
      }: {
        where?: { email?: string; createdAt?: { gte?: Date } };
      }) {
        const since = where?.createdAt?.gte?.getTime() ?? 0;
        return billingTokens.filter((row) => {
          if (where?.email && row.email !== where.email) return false;
          return row.createdAt.getTime() >= since;
        }).length;
      },
      async delete({ where }: { where: { tokenHash: string } }) {
        const index = billingTokens.findIndex((row) => row.tokenHash === where.tokenHash);
        if (index < 0) throw new Error("record not found");
        const [row] = billingTokens.splice(index, 1);
        return { ...row };
      },
    },
    comparisonRequest: {
      async upsert() {
        return { id: "req" };
      },
    },
    /**
     * Conditional quota append. Values follow custom-compare.ts:
     * pair, email, month, limit, pair.
     */
    async $executeRaw(query: TemplateStringsArray, ...values: unknown[]) {
      const sql = Array.isArray(query) ? query.join(" ") : String(query);
      if (sql.includes("pg_advisory_xact_lock")) {
        // Prisma 5.22 cannot deserialize the void result of this function
        // through $queryRaw (P2010). The real issuer uses $executeRaw.
        if (state.failBillingLock) {
          const err = new Error(state.failBillingLock);
          (err as Error & { code: string }).code = "P2010";
          throw err;
        }
        const email = String(values[0] ?? "");
        const release = await acquireEmailLock(email);
        const store = txStorage.getStore();
        if (!store) {
          release();
          throw new Error("pg_advisory_xact_lock must run inside a transaction");
        }
        store.releases.push(release);
        return 0;
      }
      if (!sql.includes("array_append") || !sql.includes("pro_custom_compare_usage")) {
        throw new Error(`unexpected raw sql: ${sql}`);
      }
      const pair = String(values[0] ?? "");
      const email = String(values[1] ?? "");
      const month = String(values[2] ?? "");
      const limit = Number(values[3]);
      const row = usage.find((item) => item.email === email && item.month === month);
      if (!row || row.pairKeys.includes(pair) || row.pairKeys.length >= limit) return 0;
      row.pairKeys.push(pair);
      row.updatedAt = new Date();
      return 1;
    },
    /**
     * Atomic billing-link redeem. The advisory lock must not arrive here:
     * $queryRaw throws P2010 on the void column pg_advisory_xact_lock returns.
     */
    async $queryRaw(query: TemplateStringsArray, ...values: unknown[]) {
      const sql = Array.isArray(query) ? query.join(" ") : String(query);
      if (sql.includes("pg_advisory_xact_lock")) {
        throw new Error(
          "pg_advisory_xact_lock must use $executeRaw; $queryRaw cannot deserialize void (P2010)"
        );
      }
      if (!sql.includes("billing_portal_tokens") || !sql.includes("RETURNING")) {
        throw new Error(`unexpected raw sql: ${sql}`);
      }
      const tokenHash = String(values[0] ?? "");
      const now = new Date();
      const row = billingTokens.find(
        (item) => item.tokenHash === tokenHash && item.usedAt == null && item.expiresAt > now
      );
      if (!row) return [];
      row.usedAt = now;
      return [{ email: row.email, stripe_customer_id: row.stripeCustomerId }];
    },
    async $transaction<T>(fn: (tx: unknown) => Promise<T>): Promise<T> {
      return txStorage.run({ releases: [] }, async () => {
        try {
          return await fn(client);
        } finally {
          const releases = txStorage.getStore()?.releases ?? [];
          for (const release of releases) release();
        }
      });
    },
  };

  return {
    client,
    members,
    usage,
    events,
    billingTokens,
    state,
    reset() {
      members.splice(0, members.length);
      usage.splice(0, usage.length);
      events.splice(0, events.length);
      billingTokens.splice(0, billingTokens.length);
      emailLockTails.clear();
      state.enabled = true;
      state.failWrites = false;
      state.failBillingLock = "";
    },
  };
}

const db = createDb();

export function resetMembershipTestDb(): void {
  db.reset();
}

export function setMembershipDbEnabled(enabled: boolean): void {
  db.state.enabled = enabled;
}

export function setMembershipDbFailWrites(fail: boolean): void {
  db.state.failWrites = fail;
}

/** Next advisory lock throws this message. Empty clears the failure. */
export function setMembershipDbFailBillingLock(message: string): void {
  db.state.failBillingLock = message;
}

export function getMembershipTestPrisma() {
  return db.state.enabled ? db.client : null;
}

export function membershipTestMembers() {
  return db.members;
}

export function membershipTestEvents() {
  return db.events;
}

export function membershipTestUsage() {
  return db.usage;
}

export function membershipTestBillingTokens() {
  return db.billingTokens;
}
