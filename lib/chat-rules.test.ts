import { describe, expect, it } from "vitest";
import { checkGuardrail, parseGroupSize } from "./chat-rules";

describe("chat rules", () => {
  it("parses a group size within the supported range", () => {
    expect(parseGroupSize("abc")).toBeNull();
    expect(parseGroupSize("6")).toBe(6);
  });

  it("identifies card-like numbers as personal data", () => {
    expect(checkGuardrail("4111 1111 1111 1111")).toBe("personal_data");
  });

  it("identifies visa questions as restricted advice", () => {
    expect(checkGuardrail("Do I need a visa for Japan?")).toBe(
      "visa_health_legal",
    );
  });
});
