import { describe, expect, it } from "vitest";
import { annualRevenue, monthlyRevenue } from "./pricing";

describe("pricing calculations", () => {
  it("calculates monthly revenue for the default user counts at each conversion rate (P1)", () => {
    const defaults = { universityUsers: 1000, organizerUsers: 200 };

    expect([
      monthlyRevenue({ ...defaults, rate: 0.02 }),
      monthlyRevenue({ ...defaults, rate: 0.05 }),
      monthlyRevenue({ ...defaults, rate: 0.1 }),
    ]).toEqual([1576, 3940, 7880]);
  });

  it("calculates annual revenue for each annual-plan share (P2)", () => {
    expect([
      annualRevenue(3940, 0),
      annualRevenue(3940, 1),
      annualRevenue(3940, 0.2),
    ]).toEqual([47280, 39400, 45704]);
  });
});
