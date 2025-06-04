import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { prisma } from "../../lib/db";
import { checkRateLimit } from "../../lib/rateLimit";
import { OpenAIApi, Configuration } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });
  if (req.method !== "POST") return res.status(405).end();

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return res.status(401).json({ error: "User not found" });

  // Example: check subscription status here, or allow limited free usage
  // TODO: Fetch subscription and check if active

  // Rate limit (e.g., 10/day for free)
  if (!checkRateLimit(user.id, 10)) {
    return res.status(429).json({ error: "Daily quota reached" });
  }

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt required" });

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `Give me 3 creative marketing ideas for: ${prompt}` }],
      max_tokens: 200,
    });
    const ideas = completion.data.choices[0].message.content;
    await prisma.idea.create({
      data: { userId: user.id, prompt, ideas }
    });
    res.status(200).json({ ideas });
  } catch (error) {
    res.status(500).json({ error: "OpenAI error" });
  }
}