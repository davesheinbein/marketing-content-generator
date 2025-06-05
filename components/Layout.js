import {
	useSession,
	signIn,
	signOut,
} from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * Modernized layout with responsive sidebar, sticky header, and dark mode toggle.
 */
export default function Layout({ children }) {
	const { data: session } = useSession();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [isDark, setIsDark] = useState(false);

	// On mount, set dark mode from localStorage or system preference
	useEffect(() => {
		const saved = localStorage.getItem('theme');
		if (
			saved === 'dark' ||
			(!saved &&
				window.matchMedia('(prefers-color-scheme: dark)')
					.matches)
		) {
			document.documentElement.classList.add('dark');
			setIsDark(true);
		} else {
			document.documentElement.classList.remove('dark');
			setIsDark(false);
		}
	}, []);

	const toggleDarkMode = () => {
		const html = document.documentElement;
		if (html.classList.contains('dark')) {
			html.classList.remove('dark');
			localStorage.setItem('theme', 'light');
			setIsDark(false);
		} else {
			html.classList.add('dark');
			localStorage.setItem('theme', 'dark');
			setIsDark(true);
		}
	};

	// Close sidebar on overlay click (mobile only)
	const handleOverlayClick = () => setSidebarOpen(false);

	return (
		<div className='min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors'>
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
						onClick={toggleDarkMode}
						className={`dark-toggle-switch${
							isDark ? ' dark' : ''
						}`}
						aria-label={
							isDark
								? 'Switch to light mode'
								: 'Switch to dark mode'
						}
						aria-pressed={isDark}
						tabIndex={0}
						type='button'
					>
						<span className='sr-only'>
							Toggle dark mode
						</span>
						<span className='icon-wrapper'>
							{/* Animated sun/moon icon */}
							<svg
								className={`icon ${
									isDark ? 'icon-moon' : 'icon-sun'
								}`}
								viewBox='0 0 24 24'
								width='28'
								height='28'
								aria-hidden='true'
								focusable='false'
							>
								<g>
									{/* Sun rays (fade out in dark mode) */}
									<g className='sun-rays'>
										<circle
											cx='12'
											cy='12'
											r='5'
											fill='currentColor'
										/>
										<g
											stroke='currentColor'
											strokeWidth={2}
										>
											<line x1='12' y1='2' x2='12' y2='4' />
											<line
												x1='12'
												y1='20'
												x2='12'
												y2='22'
											/>
											<line
												x1='4.22'
												y1='4.22'
												x2='5.64'
												y2='5.64'
											/>
											<line
												x1='18.36'
												y1='18.36'
												x2='19.78'
												y2='19.78'
											/>
											<line x1='2' y1='12' x2='4' y2='12' />
											<line
												x1='20'
												y1='12'
												x2='22'
												y2='12'
											/>
											<line
												x1='4.22'
												y1='19.78'
												x2='5.64'
												y2='18.36'
											/>
											<line
												x1='18.36'
												y1='5.64'
												x2='19.78'
												y2='4.22'
											/>
										</g>
									</g>
									{/* Moon (fade in in dark mode) */}
									<g className='moon-crescent'>
										<path
											d='M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z'
											fill='currentColor'
										/>
									</g>
								</g>
							</svg>
						</span>
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
			<main className='px-6 py-8 max-w-4xl mx-auto flex-1 w-full'>
				{children}
			</main>
			<footer className='w-full border-t py-4 px-6 flex items-center justify-between text-gray-500 text-sm flex-shrink-0'>
				<a
					href='/copyright'
					className='flex items-center gap-2 hover:underline'
					style={{ textDecoration: 'none' }}
				>
					<span aria-hidden='true'>&copy;</span>
					<span>
						Noble Beast{' '}
						{new Date().toLocaleDateString(undefined, {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</span>
				</a>
				<a
					// href='https://beastworld.vercel.app'
					href='#'
					// target='_blank'
					rel='noopener noreferrer'
					className='ml-auto text-gray-500 hover:underline'
					style={{
						cursor: 'pointer',
						textDecoration: 'none',
					}}
				>
					Beast World
				</a>
			</footer>
		</div>
	);
}
