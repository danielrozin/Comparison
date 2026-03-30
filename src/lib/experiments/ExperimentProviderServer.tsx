import { cookies } from "next/headers";
import { ExperimentProvider } from "./ExperimentProvider";
import type { ReactNode } from "react";

const COOKIE_NAME = "ab_experiments";

export async function ExperimentProviderServer({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value ?? "";

  return <ExperimentProvider initialCookie={raw}>{children}</ExperimentProvider>;
}
