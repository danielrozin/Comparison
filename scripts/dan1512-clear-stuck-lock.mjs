import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// pg_advisory_lock(72707369): single bigint key -> classid=0, objid=72707369, objsubid=1
const LOCK = 72707369;

const holders = await prisma.$queryRawUnsafe(`
  SELECT l.pid, l.granted, l.classid, l.objid, l.objsubid,
         a.state, a.application_name, a.query,
         (now() - a.state_change)::text AS idle_for
  FROM pg_locks l
  JOIN pg_stat_activity a ON a.pid = l.pid
  WHERE l.locktype = 'advisory' AND l.objid = ${LOCK}
`);

console.log("Advisory-lock holders for", LOCK, ":");
console.log(JSON.stringify(holders, (_k, v) => (typeof v === "bigint" ? v.toString() : v), 2));

let terminated = [];
for (const h of holders) {
  const pid = Number(h.pid);
  // Only terminate granted lock holders that are idle (stranded migration sessions),
  // never an actively-running query.
  const res = await prisma.$queryRawUnsafe(`SELECT pg_terminate_backend(${pid}) AS ok`);
  console.log(`pg_terminate_backend(${pid}) ->`, JSON.stringify(res, (_k, v) => (typeof v === "bigint" ? v.toString() : v)));
  terminated.push(pid);
}

console.log("Terminated PIDs:", terminated);
await prisma.$disconnect();
