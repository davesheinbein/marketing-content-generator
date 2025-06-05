import Layout from '../components/layout/Layout';

export default function AboutPage() {
	return (
		<Layout>
			<section className='max-w-2xl mx-auto py-12 px-4 text-center'>
				<h1 className='text-3xl md:text-4xl font-bold mb-4 text-blue-800 dark:text-cherry-blossom-pink'>
					About Marketing Content Generator
				</h1>
				<p className='text-lg md:text-xl mb-6 text-blue-green dark:text-timberwolf'>
					Supercharge your marketing with AI-powered idea
					generation.
					<br />
					Instantly brainstorm creative campaigns, product
					pitches, and content strategies tailored to your
					business.
					<br />
					Our platform leverages the latest in artificial
					intelligence and marketing best practices to help
					you stand out, save time, and spark innovation—no
					technical expertise required.
				</p>
			</section>
		</Layout>
	);
}
