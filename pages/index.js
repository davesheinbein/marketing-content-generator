import Pricing from '../components/pricing/Pricing';
import Layout from '../components/layout/Layout';
import Link from 'next/link';

export default function Home() {
	return (
		<Layout>
			<section className='text-center py-20'>
				<img
					src='https://i.imgur.com/1jPtNmW.png'
					alt='logo'
					className='mx-auto mb-8'
					style={{
						height: '20rem',
						width: '20rem',
						maxWidth: '90vw',
					}}
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
					className='bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700 transition inline-block'
				>
					Get Started
				</Link>
				<div className='flex justify-center mt-4'>
					<Pricing />
				</div>
			</section>
		</Layout>
	);
}
