import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { cn } from '../../../utils/cn';
import { type ToggleVariants, toggleVariants } from '../toggle/Toggle';
import { tv } from 'tailwind-variants';

const ToggleGroupContext = React.createContext<ToggleVariants>({
	size: 'md',
	variant: 'default',
});

const toggleGroupStyles = tv({
	base: 'flex items-center justify-center gap-1 w-full',
});

const ToggleGroup = React.forwardRef<
	React.ElementRef<typeof ToggleGroupPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & ToggleVariants
>(({ className, variant, size, children, ...props }, ref) => (
	<ToggleGroupPrimitive.Root ref={ref} className={toggleGroupStyles({ className })} {...props}>
		<ToggleGroupContext.Provider value={{ variant, size }}>
			{children}
		</ToggleGroupContext.Provider>
	</ToggleGroupPrimitive.Root>
));

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<
	React.ElementRef<typeof ToggleGroupPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & ToggleVariants
>(({ className, children, variant, size, ...props }, ref) => {
	const context = React.useContext(ToggleGroupContext);

	return (
		<ToggleGroupPrimitive.Item
			ref={ref}
			className={cn(
				toggleVariants({
					variant: context.variant || variant,
					size: context.size || size,
				}),
				// Mobile: make items stretch equally; desktop: intrinsic width
				'flex-1 w-full sm:flex-none sm:w-auto',
				className
			)}
			{...props}
		>
			{children}
		</ToggleGroupPrimitive.Item>
	);
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };
