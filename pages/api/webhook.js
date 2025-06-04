import { buffer } from "micro";
import Stripe from "stripe";
import { prisma } from "../../lib/db";
export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Handles Stripe subscription events to update user subscription state.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      await buffer(req),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated"
  ) {
    const sub = event.data.object;
    // Assumption: Stripe customer email matches user.email
    const stripeId = sub.id;
    const email = sub.customer_email || sub.customer?.email;
    const plan = sub.items.data[0].price.nickname || "unknown";
    const status = sub.status;
    const currentPeriodEnd = new Date(sub.current_period_end * 1000);

    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      await prisma.subscription.upsert({
        where: { userId: user.id },
        update: { stripeId, plan, status, currentPeriodEnd },
        create: { userId: user.id, stripeId, plan, status, currentPeriodEnd },
      });
    }
  }
  res.json({ received: true });
}