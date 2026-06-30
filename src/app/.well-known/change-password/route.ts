import { NextResponse } from "next/server";

// WICG Well-Known Change Password URL
// https://wicg.github.io/change-password-url/
//
// Browsers, password managers (1Password, Bitwarden, Safari), and security tools
// redirect users to this URL when they suggest changing their password.
// Required for Chrome's "Checkup" feature and iOS/macOS Passwords app integration.
export async function GET() {
  return NextResponse.redirect("https://www.aversusb.net/contact", { status: 302 });
}
