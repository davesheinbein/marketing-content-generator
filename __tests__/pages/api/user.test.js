import handler from "../../../pages/api/user";
import { createMocks } from "node-mocks-http";

jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));
import { getServerSession } from "next-auth/next";

jest.mock("../../../lib/db", () => ({
  prisma: {
    user: { findUnique: jest.fn() },
  },
}));
import { prisma } from "../../../lib/db";

describe("/api/user", () => {
  afterEach(() => jest.clearAllMocks());

  it("returns 401 if unauthenticated", async () => {
    getServerSession.mockResolvedValueOnce(null);
    const { req, res } = createMocks({ method: "GET" });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(401);
  });

  it("returns user data if authenticated", async () => {
    getServerSession.mockResolvedValueOnce({ user: { email: "test@example.com" } });
    prisma.user.findUnique.mockResolvedValueOnce({
      email: "test@example.com",
      name: "Test User",
      image: "img.jpg",
      subscription: { status: "active", plan: "Pro" },
    });
    const { req, res } = createMocks({ method: "GET" });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual(
      expect.stringContaining("test@example.com")
    );
  });
});