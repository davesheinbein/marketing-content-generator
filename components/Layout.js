import {
	useSession,
	signIn,
	signOut,
} from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

/**
 * Modernized layout with responsive sidebar, sticky header, and dark mode toggle.
 */
export default function Layout({ children }) {
	const { data: session } = useSession();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	// Close sidebar on overlay click (mobile only)
	const handleOverlayClick = () => setSidebarOpen(false);

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors'>
			{/* Sticky Header */}
			<header className='flex items-center justify-between px-6 py-4 bg-white/70 dark:bg-gray-900/80 backdrop-blur shadow-sm sticky top-0 z-20'>
				<div className='flex items-center space-x-3'>
					<button
						className='md:hidden'
						onClick={() => setSidebarOpen(!sidebarOpen)}
						aria-expanded={sidebarOpen}
						aria-controls='mobile-menu'
						aria-label='Open menu'
					>
						<span className='sr-only'>Open menu</span>
						<svg
							className='w-7 h-7 text-blue-600 dark:text-blue-300'
							fill='none'
							stroke='currentColor'
							strokeWidth={2}
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M4 6h16M4 12h16M4 18h16'
							/>
						</svg>
					</button>
					<Link href='/'>
						<span className='flex items-center font-extrabold text-2xl text-blue-700 dark:text-blue-200 tracking-tight cursor-pointer'>
							<img
								src='https://i.imgur.com/1jPtNmW.png'
								alt='IdeaGen logo'
								className='h-8 w-8 mr-2 rounded shadow border border-blue-200 dark:border-gray-700 bg-white dark:bg-gray-900 object-contain'
								style={{
									background:
										'linear-gradient(135deg, #e0e7ff 0%, #f3f4f6 100%)',
								}}
							/>
							IdeaGen
						</span>
					</Link>
				</div>
				{/* Desktop nav */}
				<nav className='hidden md:flex gap-6 items-center font-semibold text-base'>
					<Link
						href='/dashboard'
						className='hover:text-blue-600 dark:hover:text-blue-300 transition'
					>
						Dashboard
					</Link>
					<Link
						href='/pricing'
						className='hover:text-blue-600 dark:hover:text-blue-300 transition'
					>
						Upgrade
					</Link>
					<Link
						href='/terms'
						className='hover:text-blue-600 dark:hover:text-blue-300 transition'
					>
						Terms
					</Link>
					<Link
						href='/privacy'
						className='hover:text-blue-600 dark:hover:text-blue-300 transition'
					>
						Privacy
					</Link>
				</nav>
				<div className='flex items-center space-x-4'>
					<button
						onClick={() => {
							const el = document.documentElement;
							el.classList.contains('dark')
								? el.classList.remove('dark')
								: el.classList.add('dark');
						}}
						className='p-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700 transition'
						aria-label='Toggle dark mode'
					>
						<svg
							className='w-6 h-6 text-gray-700 dark:text-gray-300'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path d='M12 3v1m0 16v1m8.66-8.66l-.71.71m-13.8-.71l-.71.71m16 .71l-.71-.71m-13.8.71l-.71-.71M21 12h-1M4 12H3' />
						</svg>
					</button>
					{!session && (
						<button
							onClick={signIn}
							className='bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 transition'
						>
							Sign In
						</button>
					)}
					{session && (
						<div className='flex items-center space-x-2'>
							{session.user?.image && (
								<img
									src={session.user.image}
									alt='profile'
									className='w-8 h-8 rounded-full border'
								/>
							)}
							<button
								onClick={signOut}
								className='text-gray-600 dark:text-gray-300 hover:underline'
							>
								Sign Out
							</button>
						</div>
					)}
				</div>
			</header>
			{/* Mobile menu overlay */}
			{sidebarOpen && (
				<div
					className='fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden'
					onClick={handleOverlayClick}
					aria-hidden='true'
				/>
			)}
			{/* Mobile popover menu */}
			<div
				id='mobile-menu'
				className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-40 transform transition-transform duration-200 ease-in-out ${
					sidebarOpen
						? 'translate-x-0'
						: '-translate-x-full'
				} md:hidden`}
				tabIndex='-1'
				aria-label='Mobile navigation'
			>
				<nav className='flex flex-col gap-2 py-10 px-8'>
					<Link
						href='/dashboard'
						className='rounded px-4 py-3 text-lg hover:bg-blue-100 dark:hover:bg-gray-800 transition'
						onClick={handleOverlayClick}
					>
						Dashboard
					</Link>
					<Link
						href='/pricing'
						className='rounded px-4 py-3 text-lg hover:bg-blue-100 dark:hover:bg-gray-800 transition'
						onClick={handleOverlayClick}
					>
						Upgrade
					</Link>
					<Link
						href='/terms'
						className='rounded px-4 py-3 text-lg hover:bg-blue-100 dark:hover:bg-gray-800 transition'
						onClick={handleOverlayClick}
					>
						Terms
					</Link>
					<Link
						href='/privacy'
						className='rounded px-4 py-3 text-lg hover:bg-blue-100 dark:hover:bg-gray-800 transition'
						onClick={handleOverlayClick}
					>
						Privacy
					</Link>
				</nav>
			</div>
			{/* Main Content */}
			<main className='px-6 py-8 max-w-4xl mx-auto'>
				{children}
			</main>
		</div>
	);
}
