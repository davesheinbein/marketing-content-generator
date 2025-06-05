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
						aria-controls='sidebar-nav'
						aria-label='Open sidebar'
					>
						<span className='sr-only'>Open sidebar</span>
						<svg
							className='w-6 h-6 text-blue-600 dark:text-blue-300'
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
						<span className='font-extrabold text-2xl text-blue-700 dark:text-blue-200 tracking-tight cursor-pointer'>
							IdeaGen
						</span>
					</Link>
				</div>
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
			{/* Mobile overlay for sidebar */}
			{sidebarOpen && (
				<div
					className='fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden'
					onClick={handleOverlayClick}
					aria-hidden='true'
				/>
			)}
			{/* Sidebar nav for desktop & mobile */}
			<aside
				id='sidebar-nav'
				className={`fixed top-0 left-0 h-full w-60 bg-white dark:bg-gray-900 shadow-lg z-30 transform transition-transform duration-200 ease-in-out ${
					sidebarOpen
						? 'translate-x-0'
						: '-translate-x-full'
				} md:translate-x-0 md:static md:shadow-none`}
				tabIndex='-1'
				aria-label='Sidebar navigation'
			>
				<nav className='flex flex-col gap-1 py-8 px-6'>
					<Link
						href='/dashboard'
						className='rounded px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-800 transition'
					>
						Dashboard
					</Link>
					<Link
						href='/pricing'
						className='rounded px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-800 transition'
					>
						Upgrade
					</Link>
					<Link
						href='/terms'
						className='rounded px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-800 transition'
					>
						Terms
					</Link>
					<Link
						href='/privacy'
						className='rounded px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-800 transition'
					>
						Privacy
					</Link>
				</nav>
			</aside>
			{/* Main Content */}
			<main className='md:ml-60 px-6 py-8 max-w-4xl mx-auto'>
				{children}
			</main>
		</div>
	);
}
