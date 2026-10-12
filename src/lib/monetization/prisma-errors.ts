/** True for Prisma unique-constraint failures and test doubles that use the same code. */
export function isUniqueConstraintError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: unknown }).code === "P2002"
  );
}

/** Thrown when the membership database cannot be written. Stripe should retry. */
export class MembershipStoreError extends Error {
  constructor(message = "Membership database is unavailable") {
    super(message);
    this.name = "MembershipStoreError";
  }
}
