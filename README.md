# Marketing Idea Generator

A production-ready SaaS app that generates creative marketing ideas with AI.  
Features OAuth login, Stripe/PayPal payments, user dashboard, idea history, and more.

## Stack

- Next.js, React, Tailwind CSS
- NextAuth.js (OAuth)
- Stripe & PayPal (payments)
- Prisma (Postgres DB)
- OpenAI API
- Vercel (deployment)

## Setup

1. Clone repo & install dependencies.
2. Create `.env.local` from `.env.local.example`
3. Run database migrations:
   ```
   npx prisma migrate dev
   ```
4. Start dev server:
   ```
   npm run dev
   ```
5. Set up Stripe & PayPal products/plans.

## Notes

- Make sure all required environment variables are set in `.env.local`.
- Stripe and PayPal products/plans must be created in your respective dashboards and their IDs added to the environment/config files.
- For production, swap the in-memory rate limiter with a persistent store (e.g., Redis).
- Test coverage is provided for API routes and utility functions in the `__tests__` directory.

## Legal

- [Terms of Service](pages/terms.js)
- [Privacy Policy](pages/privacy.js)
