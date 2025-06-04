import handler from "../../../pages/api/ideas";
import { createMocks } from "node-mocks-http";

jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));
import { getServerSession } from "next-auth/next";

jest.mock("../../../lib/db", () => ({
  prisma: {
    user: { findUnique: jest.fn() },
    idea: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));
import { prisma } from "../../../lib/db";

describe("/api/ideas", () => {
  afterEach(() => jest.clearAllMocks());

  it("returns 401 if unauthenticated", async () => {
    getServerSession.mockResolvedValueOnce(null);
    const { req, res } = createMocks({ method: "GET" });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(401);
  });

  it("returns ideas and total", async () => {
    getServerSession.mockResolvedValueOnce({ user: { email: "test@example.com" } });
    prisma.user.findUnique.mockResolvedValueOnce({ id: "u1" });
    prisma.idea.findMany.mockResolvedValueOnce([{ id: "i1", prompt: "foo", ideas: "bar", createdAt: new Date() }]);
    prisma.idea.count.mockResolvedValueOnce(1);
    const { req, res } = createMocks({ method: "GET", query: {} });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    const json = JSON.parse(res._getData());
    expect(json.ideas.length).toBe(1);
    expect(json.total).toBe(1);
  });
});