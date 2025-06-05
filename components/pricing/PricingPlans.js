import PayPalButton from '../payment/PayPalButton';
import PayPalPlanButtons from '../payment/PayPalPlanButtons';

const plans = [
	{
		name: 'Monthly',
		price: '$9.99/mo',
		priceId: 'price_monthly_xxx', // Stripe Price ID
		paypalPlanId: 'P-XXXXXXXXXXMONTH',
		description: 'Billed monthly, cancel anytime.',
	},
	{
		name: 'Yearly',
		price: '$99.99/yr',
		priceId: 'price_yearly_xxx',
		paypalPlanId: 'P-XXXXXXXXXXYEAR',
		description: 'Save 17% over monthly.',
	},
	{
		name: '2 Years',
		price: '$179.99/2yr',
		priceId: 'price_2year_xxx',
		paypalPlanId: 'P-XXXXXXXXXX2YEAR',
		description: 'Best value, save 25%.',
	},
];

export default function PricingPlans({
	onStripe,
	onPayPal,
}) {
	return (
		<div className='grid md:grid-cols-3 gap-6'>
			{plans.map((plan) => (
				<div
					key={plan.name}
					className='bg-white shadow rounded p-6 flex flex-col items-center'
				>
					<h2 className='text-2xl font-bold mb-2'>
						{plan.name}
					</h2>
					<div className='text-3xl text-blue-600 mb-2'>
						{plan.price}
					</div>
					<p className='mb-4 text-gray-500'>
						{plan.description}
					</p>
					<button
						className='bg-blue-600 text-white px-4 py-2 rounded mb-2 w-full'
						onClick={() => onStripe(plan.priceId)}
					>
						Pay with Card (Stripe)
					</button>
					<button
						className='bg-yellow-500 text-white px-4 py-2 rounded w-full'
						onClick={() => onPayPal(plan.paypalPlanId)}
					>
						Pay with PayPal
					</button>
				</div>
			))}
		</div>
	);
}
