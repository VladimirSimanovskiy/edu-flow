import { tv } from 'tailwind-variants';

const requiredIconStyles = tv({
	base: 'stroke-status-error',
});

interface RequiredIconProps {
	className?: string;
}

export function RequiredIcon({ className }: RequiredIconProps) {
	return (
		<svg
			className={requiredIconStyles({ className })}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
		>
			<path
				d="M12.0001 3V21M20 7.5L4 16.5M4 7.5L20 16.5"
				strokeWidth="3"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
