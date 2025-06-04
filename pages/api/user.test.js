import handler from "./user";
import { createMocks } from "node-mocks-http";

// Mock NextAuth getServerSession
jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));
import { getServerSession } from "next-auth/next";

// Mock Prisma client
jest.mock("../../lib/db", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));
import { prisma } from "../../lib/db";

describe("/api/user API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 if not authenticated", async () => {
    getServerSession.mockResolvedValueOnce(null);
    const { req, res } = createMocks({ method: "GET" });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getData()).toMatch(/Unauthorized/);
  });

  it("returns user and subscription if authenticated", async () => {
    getServerSession.mockResolvedValueOnce({ user: { email: "test@example.com" } });
    prisma.user.findUnique.mockResolvedValueOnce({
      email: "test@example.com",
      name: "Test User",
      image: "test.jpg",
      subscription: { status: "active", plan: "Pro" },
    });
    const { req, res } = createMocks({ method: "GET" });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const json = JSON.parse(res._getData());
    expect(json.email).toBe("test@example.com");
    expect(json.subscription).toEqual({ status: "active", plan: "Pro" });
  });

  it("returns 404 if user not found", async () => {
    getServerSession.mockResolvedValueOnce({ user: { email: "missing@example.com" } });
    prisma.user.findUnique.mockResolvedValueOnce(null);
    const { req, res } = createMocks({ method: "GET" });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(res._getData()).toMatch(/User not found/);
  });
});