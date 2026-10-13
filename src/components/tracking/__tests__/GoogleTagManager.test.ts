import vm from "node:vm";
import { describe, expect, it } from "vitest";
import { CONSENT_DEFAULTS_SCRIPT, gtagInitScript } from "../GoogleTagManager";

// Runs inline scripts the way the browser does: sloppy-mode global code on a
// shared window object.
function makeWindow(cookie = "") {
  const win: Record<string, unknown> = { document: { cookie } };
  win.window = win;
  return vm.createContext(win);
}

function commands(ctx: vm.Context): unknown[][] {
  return (ctx.dataLayer as IArguments[]).map((a) => Array.from(a));
}

describe("gtagInitScript (ROO-152)", () => {
  it("does not throw when consent-defaults never ran (route-level 404)", () => {
    const ctx = makeWindow();
    expect(() => vm.runInContext(gtagInitScript("G-TEST", "AW-TEST"), ctx)).not.toThrow();
    const cmds = commands(ctx);
    expect(cmds[0][0]).toBe("consent");
    expect(cmds[0][1]).toBe("default");
    expect(cmds.slice(1).map((c) => c[0])).toEqual(["js", "config", "config"]);
    expect(cmds[2][1]).toBe("G-TEST");
    expect(cmds[3][1]).toBe("AW-TEST");
  });

  it("keeps EU consent defaults denied on that path", () => {
    const ctx = makeWindow("consent_region=eu");
    vm.runInContext(gtagInitScript("G-TEST"), ctx);
    const [, , defaults] = commands(ctx)[0] as [string, string, Record<string, string>];
    expect(defaults.analytics_storage).toBe("denied");
    expect(defaults.ad_storage).toBe("denied");
  });

  it("is a no-op guard on normal pages (consent-defaults already ran)", () => {
    const ctx = makeWindow();
    vm.runInContext(CONSENT_DEFAULTS_SCRIPT, ctx);
    const stub = ctx.gtag;
    vm.runInContext(gtagInitScript("G-TEST"), ctx);
    expect(ctx.gtag).toBe(stub);
    const cmds = commands(ctx);
    expect(cmds.filter((c) => c[0] === "consent")).toHaveLength(1);
    expect(cmds.map((c) => c[0])).toEqual(["consent", "js", "config"]);
  });
});
