import { buffer } from 'micro';
import Stripe from 'stripe';
import { prisma } from '../../lib/db';
export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Handles Stripe subscription events to update user subscription state.
 */
export default async function handler(req, res) {
	console.log('[webhook] Stripe webhook handler called');
	if (req.method !== 'POST') return res.status(405).end();

	const sig = req.headers['stripe-signature'];
	let event;
	try {
		event = stripe.webhooks.constructEvent(
			await buffer(req),
			sig,
			process.env.STRIPE_WEBHOOK_SECRET
		);
		console.log(
			'[webhook] Stripe event received:',
			event.type
		);
	} catch (err) {
		console.error(
			'[webhook] Stripe webhook error:',
			err.message
		);
		return res
			.status(400)
			.send(`Webhook Error: ${err.message}`);
	}

	if (
		event.type === 'customer.subscription.created' ||
		event.type === 'customer.subscription.updated'
	) {
		const sub = event.data.object;
		console.log(
			'[webhook] Subscription event:',
			sub.id,
			sub.status
		);

		// Assumption: Stripe customer email matches user.email
		const stripeId = sub.id;
		const email = sub.customer_email || sub.customer?.email;
		const plan =
			sub.items.data[0].price.nickname || 'unknown';
		const status = sub.status;
		const currentPeriodEnd = new Date(
			sub.current_period_end * 1000
		);

		const user = await prisma.user.findUnique({
			where: { email },
		});
		if (user) {
			await prisma.subscription.upsert({
				where: { userId: user.id },
				update: {
					stripeId,
					plan,
					status,
					currentPeriodEnd,
				},
				create: {
					userId: user.id,
					stripeId,
					plan,
					status,
					currentPeriodEnd,
				},
			});
		}
	}

	// Handle subscription cancellation or payment failure
	if (
		event.type === 'customer.subscription.deleted' ||
		event.type === 'invoice.payment_failed'
	) {
		const sub = event.data.object;
		const stripeId = sub.id;
		// Find the subscription by stripeId
		const subscription =
			await prisma.subscription.findUnique({
				where: { stripeId },
			});
		if (subscription) {
			await prisma.subscription.update({
				where: { stripeId },
				update: {
					status: 'canceled',
					currentPeriodEnd: new Date(),
				},
			});
		}
	}
	res.json({ received: true });
}
