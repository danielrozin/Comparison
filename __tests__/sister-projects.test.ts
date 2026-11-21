import { describe, expect, it } from "vitest";
import { SISTER_PROJECTS, sisterOrganizationSchemas } from "@/lib/data/sister-projects";
import { FOUNDERS, founderPersonSchema } from "@/lib/data/founders";

describe("sister projects entity layer", () => {
  it("each project is an Organization founded by both founder Person @ids", () => {
    const ids = FOUNDERS.map((f) => f.personId);
    for (const org of sisterOrganizationSchemas()) {
      expect(org["@type"]).toBe("Organization");
      expect(org["@id"]).toMatch(/^https:\/\/[a-z0-9.]+\/#organization$/);
      expect(org.founder.map((f) => f["@id"])).toEqual(ids);
    }
  });

  it("covers Goldenroz, Scan2Remember and cpgsite with brand-name anchors", () => {
    expect(SISTER_PROJECTS.map((p) => p.url).sort()).toEqual(
      ["https://cpgsite.com", "https://goldenroz.com", "https://scan2remember.com"],
    );
    for (const p of SISTER_PROJECTS) {
      expect(p.summary.length).toBeLessThanOrEqual(200);
      expect(p.blurb).not.toMatch(/^[A-Z]/);
    }
  });

  it("founder Person nodes point at every sister org and work for Goldenroz", () => {
    const person = founderPersonSchema(FOUNDERS[0]) as unknown as {
      worksFor: { "@id": string }[];
      founderOf: { "@id": string }[];
    };
    const orgIds = sisterOrganizationSchemas().map((o) => o["@id"]);
    expect(person.founderOf.map((o) => o["@id"])).toEqual(expect.arrayContaining(orgIds));
    expect(person.worksFor.map((o) => o["@id"])).toContain("https://goldenroz.com/#organization");
  });
});
