import { useState } from 'react';
import PricingPlans from '../components/pricing/PricingPlans';
import Layout from '../components/layout/Layout';

export default function PricingPage() {
	const [loading, setLoading] = useState(false);

	const handleStripe = async (priceId) => {
		setLoading(true);
		const res = await fetch(
			'/api/create-checkout-session',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ priceId }),
			}
		);
		const data = await res.json();
		if (data.url) window.location = data.url;
		setLoading(false);
	};

	const handlePayPal = (paypalPlanId) => {
		// Optionally show/hide PayPal buttons for selected plan, or pass plan ID to PayPalPlanButtons
		window.open(
			`https://www.paypal.com/checkoutnow?plan_id=${paypalPlanId}`,
			'_blank'
		);
	};

	return (
		<Layout>
			<h1 className='text-3xl font-bold mb-8'>
				Upgrade Your Plan
			</h1>
			<PricingPlans
				onStripe={handleStripe}
				onPayPal={handlePayPal}
			/>
			{loading && (
				<div className='mt-6 text-center text-blue-500'>
					Redirecting to payment...
				</div>
			)}
		</Layout>
	);
}
