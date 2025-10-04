import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { tv } from 'tailwind-variants';
import { cn } from '../../../utils/cn';

const popoverStyles = tv({
	base: 'z-50 w-72 origin-[--radix-popover-content-transform-origin] rounded-lg border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
});

type PopoverContentProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
	/**
	 * Контейнер для портала. Если не указан, используется хук usePortalContainer
	 * для поиска PortalContainer
	 */
	portalContainer?: HTMLElement;
};

/**
 * Корневой компонент Popover, который оборачивает всю функциональность всплывающего окна.
 * Построен на основе Radix UI Popover primitive.
 */
const Popover = PopoverPrimitive.Root;

/**
 * Элемент-триггер, который открывает всплывающее окно при клике.
 */
const PopoverTrigger = PopoverPrimitive.Trigger;

/**
 * Элемент-якорь, относительно которого позиционируется всплывающее окно.
 */
const PopoverAnchor = PopoverPrimitive.Anchor;

/**
 * Компонент содержимого всплывающего окна.
 */
const PopoverContent = React.forwardRef<
	React.ElementRef<typeof PopoverPrimitive.Content>,
	PopoverContentProps
>(({ className, align = 'center', sideOffset = 4, portalContainer, ...props }, ref) => {
	return (
		<PopoverPrimitive.Portal container={portalContainer}>
			<PopoverPrimitive.Content
				// Фикс скроллинга внутри Popover когда он находится в Dialog
				// RemoveScroll в Dialog блокирует прокрутку body, но может блокировать и вложенные элементы
				// stopPropagation предотвращает всплытие событий скроллинга к заблокированному body
				// https://github.com/radix-ui/primitives/issues/1159
				onWheel={e => {
					e.stopPropagation();
				}}
				onTouchMove={e => {
					e.stopPropagation();
				}}
				ref={ref}
				align={align}
				sideOffset={sideOffset}
				className={cn(popoverStyles(), className)}
				{...props}
			/>
		</PopoverPrimitive.Portal>
	);
});
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
