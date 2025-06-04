import handler from "../pages/api/user";
import { createMocks } from "node-mocks-http";
import { prisma } from "../lib/db";

jest.mock("../lib/db");

describe("/api/user", () => {
  it("returns 401 if not authenticated", async () => {
    const { req, res } = createMocks({ method: "GET" });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(401);
  });
  // Additional tests for authenticated user and error cases would go here.
});