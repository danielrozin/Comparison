import type { Metadata } from "next";
import { redirect } from "next/navigation";

// The paid usability-study recruitment (DAN-1980) has been retired. The banner,
// form, and sign-up endpoint were removed so no new participants are collected
// and the "$25 gift card" promise is no longer live. Any lingering link to
// /ux-study now redirects home instead of showing the (removed) offer.
export const metadata: Metadata = {
  title: "A Versus B",
  robots: { index: false, follow: false },
};

export default function UxStudyPage() {
  redirect("/");
}
