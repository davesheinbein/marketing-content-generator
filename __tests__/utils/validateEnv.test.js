import { validateEnv } from "../../utils/validateEnv";

describe("validateEnv", () => {
  it("throws if any env var is missing", () => {
    expect(() => validateEnv(["SOME_FAKE_ENV"])).toThrow(/Missing required env var/);
  });
  it("passes when all are present", () => {
    process.env.TEST_ENV = "1";
    expect(() => validateEnv(["TEST_ENV"])).not.toThrow();
  });
});