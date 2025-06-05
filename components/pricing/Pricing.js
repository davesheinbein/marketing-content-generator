import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Pricing() {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubscribe = () => {
		setLoading(true);
		router.push('/pricing');
	};

	return (
		<button
			className='bg-blue-600 text-white px-6 py-3 rounded'
			onClick={handleSubscribe}
			disabled={loading}
		>
			{loading ? 'Redirecting...' : 'Subscribe Now'}
		</button>
	);
}
