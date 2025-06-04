import { checkRateLimit } from "../../lib/rateLimit";

describe("checkRateLimit", () => {
  it("allows up to the limit", () => {
    const userId = "user1";
    for (let i = 0; i < 10; i++) {
      expect(checkRateLimit(userId, 10)).toBe(true);
    }
    // 11th time should be false
    expect(checkRateLimit(userId, 10)).toBe(false);
  });
});