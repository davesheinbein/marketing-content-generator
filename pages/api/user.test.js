import handler from './user';
import { createMocks } from 'node-mocks-http';

// Mock NextAuth getServerSession
jest.mock('next-auth/next', () => ({
	getServerSession: jest.fn(),
}));
import { getServerSession } from 'next-auth/next';

// Mock Prisma client
jest.mock('../../lib/db', () => ({
	prisma: {
		user: {
			findUnique: jest.fn(),
		},
	},
}));
import { prisma } from '../../lib/db';

describe('/api/user API', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('returns 401 if not authenticated', async () => {
		getServerSession.mockResolvedValueOnce(null);
		const { req, res } = createMocks({ method: 'GET' });

		await handler(req, res);

		expect(res._getStatusCode()).toBe(401);
		expect(res._getData()).toMatch(/Unauthorized/);
	});

	it('returns user and subscription if authenticated', async () => {
		getServerSession.mockResolvedValueOnce({
			user: { email: 'test@example.com' },
		});
		prisma.user.findUnique.mockResolvedValueOnce({
			email: 'test@example.com',
			name: 'Test User',
			image: 'test.jpg',
			subscription: { status: 'active', plan: 'Pro' },
		});
		const { req, res } = createMocks({ method: 'GET' });

		await handler(req, res);

		expect(res._getStatusCode()).toBe(200);
		const data = JSON.parse(res._getData());
		expect(data).toEqual({
			email: 'test@example.com',
			name: 'Test User',
			image: 'test.jpg',
			subscription: { status: 'active', plan: 'Pro' },
		});
	});

	it('returns 404 if user not found', async () => {
		getServerSession.mockResolvedValueOnce({
			user: { email: 'notfound@example.com' },
		});
		prisma.user.findUnique.mockResolvedValueOnce(null);
		const { req, res } = createMocks({ method: 'GET' });

		await handler(req, res);

		expect(res._getStatusCode()).toBe(404);
		expect(res._getData()).toMatch(/User not found/);
	});
});

// Enhancements:
// - Added a test for the 404 case (user not found)
// - Added a full test for the 200 case (user and subscription returned)
// - Used clearAllMocks for test isolation
// - Used consistent naming and formatting for clarity
