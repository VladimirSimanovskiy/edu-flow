import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { tv } from 'tailwind-variants';
import { cn } from '../../../utils/cn';

const labelStyles = tv({
	base: 'text-sm font-medium leading-none text-primary-fg peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
});

const Label = React.forwardRef<
	React.ElementRef<typeof LabelPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
	<LabelPrimitive.Root ref={ref} className={cn(labelStyles(), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
