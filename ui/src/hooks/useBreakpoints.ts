import { useEffect, useState } from 'react';

/**
 * Хук для определения размера экрана
 */
export const useBreakpoints = () => {
	const [breakpoint, setBreakpoint] = useState<'sm' | 'md' | 'lg' | 'xl' | '2xl'>('lg');

	useEffect(() => {
		const updateBreakpoint = () => {
			const width = window.innerWidth;
			if (width < 640) setBreakpoint('sm');
			else if (width < 768) setBreakpoint('md');
			else if (width < 1024) setBreakpoint('lg');
			else if (width < 1280) setBreakpoint('xl');
			else setBreakpoint('2xl');
		};

		updateBreakpoint();
		window.addEventListener('resize', updateBreakpoint);
		return () => window.removeEventListener('resize', updateBreakpoint);
	}, []);

	return breakpoint;
};

/**
 * Хук для определения мобильного устройства
 */
export const useIsMobile = () => {
	const breakpoint = useBreakpoints();
	return breakpoint === 'sm' || breakpoint === 'md';
};