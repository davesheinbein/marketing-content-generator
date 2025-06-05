import React, { useState, useRef } from 'react';
import Loader from '../Loader';
import ErrorMessage from '../ErrorMessage';

console.log('[IdeaGenerator] Component loaded');

/**
 * Enhanced idea generation form with quota display, accessibility, and modern UI/UX.
 */
export default function IdeaGenerator({
	onNewIdeas,
	quota,
	isPro,
}) {
	console.log(
		'[IdeaGenerator] Rendered, styles should be applied'
	);
	const [prompt, setPrompt] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const inputRef = useRef(null);

	// Quota logic helper
	const quotaUsed = quota?.used || 0;
	const quotaLimit = quota?.limit || 10;
	const quotaNearLimit =
		!isPro && quotaUsed >= quotaLimit - 2;
	const quotaExceeded = !isPro && quotaUsed >= quotaLimit;
	const isPromptEmpty = !prompt.trim();

	const handleGenerate = async (e) => {
		e.preventDefault();
		if (isPromptEmpty) {
			setError('Please enter a keyword or phrase.');
			return;
		}
		setError('');
		setLoading(true);
		try {
			const res = await fetch('/api/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ prompt }),
			});
			const data = await res.json();
			if (res.ok) {
				onNewIdeas(data.ideas);
				setPrompt('');
				inputRef.current?.focus();
			} else {
				setError(
					data.error ||
						'Failed to generate ideas. Please try again.'
				);
			}
		} catch (err) {
			setError('Network error. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (e) => {
		setPrompt(e.target.value);
		if (error) setError('');
	};

	return (
		<div className='flex flex-col items-center justify-center min-h-[60vh] w-full bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:to-gray-800 py-8 px-2'>
			<img
				src='https://i.imgur.com/1jPtNmW.png'
				alt='Marketing Idea Generator Logo'
				className='h-20 w-20 mb-6 rounded-xl shadow-lg border-2 border-blue-200 dark:border-gray-700 bg-white dark:bg-gray-900 object-contain'
				style={{
					background:
						'linear-gradient(135deg, #e0e7ff 0%, #f3f4f6 100%)',
				}}
			/>
			<form
				onSubmit={handleGenerate}
				autoComplete='off'
				className='w-full max-w-xl bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl p-10 flex flex-col gap-6 border border-gray-200 dark:border-gray-700 transition-all duration-200 items-center'
				aria-labelledby='idea-generator-title'
			>
				<label
					htmlFor='prompt'
					className='font-extrabold text-2xl md:text-3xl text-center text-blue-800 dark:text-blue-100 mb-2 tracking-tight'
					id='idea-generator-title'
				>
					Generate Marketing Ideas
				</label>
				<input
					ref={inputRef}
					id='prompt'
					name='prompt'
					type='text'
					className='w-full px-6 py-4 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg md:text-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-150 shadow-md hover:border-blue-400'
					placeholder='Enter a product, business, or keyword...'
					value={prompt}
					onChange={handleInputChange}
					disabled={loading || quotaExceeded}
					aria-invalid={!!error}
					aria-describedby={
						error ? 'prompt-error' : undefined
					}
					autoFocus
				/>
				<div className='flex flex-col md:flex-row items-center gap-4 min-h-[32px] w-full justify-center'>
					<button
						type='submit'
						className={`bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-lg md:text-xl px-8 py-3 rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg focus:ring-2 focus:ring-blue-400 focus:outline-none`}
						disabled={
							loading || quotaExceeded || isPromptEmpty
						}
						aria-disabled={
							loading || quotaExceeded || isPromptEmpty
						}
					>
						{loading && <Loader />}
						{loading ? 'Generating...' : 'Generate Ideas'}
					</button>
					{/* Show quota info for free users */}
					{!isPro && (
						<span
							className={`text-base md:text-lg ml-2 ${
								quotaNearLimit
									? 'text-orange-500 font-semibold'
									: 'text-gray-500'
							}`}
						>
							{quotaExceeded ? (
								<span className='font-semibold text-red-600'>
									Daily quota reached
								</span>
							) : (
								<>
									{`Ideas used: ${quotaUsed}/${quotaLimit}`}
									{quotaNearLimit && (
										<span className='ml-1 text-orange-500'>
											(Almost out!)
										</span>
									)}
								</>
							)}
						</span>
					)}
				</div>
				{/* Upgrade prompt for free users at quota */}
				{quotaExceeded && !isPro && (
					<div className='w-full bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 text-yellow-900 dark:text-yellow-100 px-6 py-4 rounded-xl text-base md:text-lg mt-2 border border-yellow-300 dark:border-yellow-700 shadow-md text-center'>
						You’ve reached your daily free quota.{' '}
						<a
							href='/pricing'
							className='underline font-bold text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-200 transition'
						>
							Upgrade to Pro
						</a>{' '}
						for unlimited ideas.
					</div>
				)}
				<ErrorMessage message={error} />
			</form>
		</div>
	);
}
