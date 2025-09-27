import * as React from 'react';
import * as RadixContextMenu from '@radix-ui/react-context-menu';
import { cn } from '../../utils/cn';

export const ContextMenu = RadixContextMenu.Root;
export const ContextMenuTrigger = RadixContextMenu.Trigger;

export const ContextMenuContent = React.forwardRef<
	React.ElementRef<typeof RadixContextMenu.Content>,
	React.ComponentPropsWithoutRef<typeof RadixContextMenu.Content>
>(({ className, ...props }, ref) => (
	<RadixContextMenu.Portal>
		<RadixContextMenu.Content
			ref={ref}
			className={cn(
				'z-[1050] min-w-[180px] rounded-md border border-gray-200 bg-white p-1 shadow-md',
				'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
				className
			)}
			{...props}
		/>
	</RadixContextMenu.Portal>
));
ContextMenuContent.displayName = 'ContextMenuContent';

export const ContextMenuItem = React.forwardRef<
	React.ElementRef<typeof RadixContextMenu.Item>,
	React.ComponentPropsWithoutRef<typeof RadixContextMenu.Item>
>(({ className, ...props }, ref) => (
	<RadixContextMenu.Item
		ref={ref}
		className={cn(
			'flex cursor-pointer select-none items-center rounded px-2 py-1 text-sm text-gray-900 outline-none',
			'data-[highlighted]:bg-gray-100',
			className
		)}
		{...props}
	/>
));
ContextMenuItem.displayName = 'ContextMenuItem';

export const ContextMenuSeparator = React.forwardRef<
	React.ElementRef<typeof RadixContextMenu.Separator>,
	React.ComponentPropsWithoutRef<typeof RadixContextMenu.Separator>
>(({ className, ...props }, ref) => (
	<RadixContextMenu.Separator
		ref={ref}
		className={cn('my-1 h-px bg-gray-200', className)}
		{...props}
	/>
));
ContextMenuSeparator.displayName = 'ContextMenuSeparator';
