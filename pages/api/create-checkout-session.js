import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const { priceId } = req.body;
  if (!priceId) return res.status(400).json({ error: "Missing priceId" });

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: session.user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing?canceled=true`,
    });
    res.status(200).json({ url: checkoutSession.url });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}