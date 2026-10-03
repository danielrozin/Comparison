/**
 * In-memory stand-in for the Pro membership tables. Tests point
 * `getPrisma` at `getMembershipTestPrisma()` so access checks run without
 * Redis and without a real database.
 */

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
  let seq = 0;
  const state = { enabled: true, failWrites: false };

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
     * Atomic billing-link redeem. Marks used_at only when the hash matches
     * an unused, unexpired row, then returns that row.
     */
    async $queryRaw(query: TemplateStringsArray, ...values: unknown[]) {
      const sql = Array.isArray(query) ? query.join(" ") : String(query);
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
    $transaction: async <T>(fn: (tx: unknown) => Promise<T>): Promise<T> => fn(undefined),
  };
  client.$transaction = (fn) => fn(client);

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
      state.enabled = true;
      state.failWrites = false;
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
