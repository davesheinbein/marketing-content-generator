import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { prisma } from "../../lib/db";

/**
 * Returns user profile and subscription info for the dashboard.
 */
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { subscription: true }
  });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.status(200).json({
    email: user.email,
    name: user.name,
    image: user.image,
    subscription: user.subscription
  });
}