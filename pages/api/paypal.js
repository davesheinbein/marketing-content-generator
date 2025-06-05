import fetch from 'node-fetch';

// POST /api/paypal/token - Get PayPal access token
export default async function handler(req, res) {
	if (req.method !== 'POST') return res.status(405).end();

	const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
	const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
	if (!clientId || !clientSecret) {
		return res
			.status(500)
			.json({ error: 'PayPal credentials not set' });
	}

	const auth = Buffer.from(
		`${clientId}:${clientSecret}`
	).toString('base64');

	try {
		const response = await fetch(
			'https://api-m.paypal.com/v1/oauth2/token',
			{
				method: 'POST',
				headers: {
					'Authorization': `Basic ${auth}`,
					'Content-Type':
						'application/x-www-form-urlencoded',
				},
				body: 'grant_type=client_credentials',
			}
		);
		const data = await response.json();
		if (!response.ok)
			throw new Error(
				data.error_description || 'PayPal token error'
			);
		res
			.status(200)
			.json({ access_token: data.access_token });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}
