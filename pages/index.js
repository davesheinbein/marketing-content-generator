import Pricing from '../components/Pricing';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home() {
	return (
		<Layout>
			<section className='text-center py-20'>
				<img
					src='/logo.svg'
					alt='logo'
					className='mx-auto h-16 mb-4'
				/>
				<h1 className='text-4xl font-extrabold mb-4 text-blue-800'>
					Marketing Idea Generator
				</h1>
				<p className='text-lg mb-8 max-w-xl mx-auto'>
					Instantly generate creative marketing ideas for
					any business or keyword. Save, share, and
					brainstorm with AI.
				</p>
				<Link
					href='/dashboard'
					className='bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700 transition'
				>
					Get Started
				</Link>
			</section>
			<Pricing />
		</Layout>
	);
}
