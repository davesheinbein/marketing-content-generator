import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { prisma } from "../../lib/db";

/**
 * Returns user's generated ideas, paginated.
 */
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const { page = 1, perPage = 10 } = req.query;
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const [ideas, count] = await Promise.all([
    prisma.idea.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      skip: (Number(page) - 1) * Number(perPage),
      take: Number(perPage),
    }),
    prisma.idea.count({ where: { userId: user.id } })
  ]);

  res.status(200).json({ ideas, total: count });
}