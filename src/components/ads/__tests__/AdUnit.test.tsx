/**
 * The fluid in-content slot threw a TagError ("Fluid responsive ads must be at
 * least 250px wide") when it pushed before the <ins> had a measurable width.
 * These checks confirm the push waits for a width of at least 250px.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render } from "@testing-library/react";

const PUB_ID = "pub-1234567890";
const SLOT = "1234567890";

let resizeCallbacks: Array<() => void> = [];

class MockResizeObserver {
  private readonly callback: () => void;
  constructor(callback: () => void) {
    this.callback = callback;
  }
  observe() {
    resizeCallbacks.push(this.callback);
  }
  disconnect() {}
}

function setWidth(el: Element, width: number) {
  Object.defineProperty(el, "offsetWidth", { configurable: true, value: width });
}

async function renderAd() {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_ADSENSE_PUB_ID", PUB_ID);
  const { AdUnit } = await import("../AdUnit");
  const view = render(<AdUnit slot={SLOT} format="fluid" />);
  const ins = view.container.querySelector("ins.adsbygoogle")!;
  return { view, ins };
}

beforeEach(() => {
  resizeCallbacks = [];
  vi.stubGlobal("ResizeObserver", MockResizeObserver);
  (window as unknown as Record<string, { push: ReturnType<typeof vi.fn> }>).adsbygoogle =
    { push: vi.fn() };
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

function push() {
  return (window as unknown as Record<string, { push: ReturnType<typeof vi.fn> }>)
    .adsbygoogle.push;
}

describe("AdUnit width gating", () => {
  it("does not push while the slot has no measurable width", async () => {
    const { ins } = await renderAd();

    expect(push()).not.toHaveBeenCalled();

    setWidth(ins, 0);
    resizeCallbacks.forEach((cb) => cb());
    expect(push()).not.toHaveBeenCalled();
  });

  it("does not push while the slot is narrower than 250px", async () => {
    const { ins } = await renderAd();

    setWidth(ins, 249);
    resizeCallbacks.forEach((cb) => cb());
    expect(push()).not.toHaveBeenCalled();
  });

  it("pushes once the slot reaches 250px, and only once", async () => {
    const { ins } = await renderAd();

    setWidth(ins, 250);
    resizeCallbacks.forEach((cb) => cb());
    expect(push()).toHaveBeenCalledTimes(1);

    resizeCallbacks.forEach((cb) => cb());
    expect(push()).toHaveBeenCalledTimes(1);
  });
});
