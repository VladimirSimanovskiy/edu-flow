import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { tv } from 'tailwind-variants';
import { cn } from '../../../utils/cn';

const Modal = DialogPrimitive.Root;
Modal.displayName = 'Modal';

const ModalTrigger = DialogPrimitive.Trigger;
ModalTrigger.displayName = 'ModalTrigger';

const ModalPortal = DialogPrimitive.Portal;
ModalPortal.displayName = 'ModalPortal';

const modalOverlayStyles = tv({
	base: [
		'fixed inset-0 z-50 bg-black/80',
		'data-[state=open]:animate-in data-[state=closed]:animate-out',
		'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
	],
});

const ModalOverlay = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Overlay ref={ref} className={cn(modalOverlayStyles(), className)} {...props} />
));
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

const modalContentStyles = tv({
	base: [
		'fixed left-[50%] top-[50%] z-50 max-h-[90vh] w-full max-w-lg translate-x-[-50%] translate-y-[-50%]',
		'flex flex-col gap-0 overflow-hidden rounded-xl bg-background p-0 shadow-lg',
		'duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out',
		'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
		'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
		'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
		'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
	],
	slots: {
		closeButton:
			'absolute right-4 top-4 z-50 h-6 w-6 p-0 text-muted-foreground hover:text-foreground',
		closeIcon: 'h-4 w-4',
	},
});

const ModalContent = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
		showCloseButton?: boolean;
	}
>(({ className, children, showCloseButton = true, ...props }, ref) => {
	const styles = modalContentStyles();
	return (
		<ModalPortal>
			<ModalOverlay />
			<DialogPrimitive.Content ref={ref} className={cn(styles.base(), className)} {...props}>
				{children}
				{showCloseButton && (
					<DialogPrimitive.Close className={styles.closeButton()}>
						<X className={styles.closeIcon()} />
					</DialogPrimitive.Close>
				)}
			</DialogPrimitive.Content>
		</ModalPortal>
	);
});
ModalContent.displayName = DialogPrimitive.Content.displayName;

const modalHeaderStyles = tv({
	base: 'flex flex-col space-y-1.5 text-center sm:text-left p-6 pb-0',
});

const ModalHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn(modalHeaderStyles(), className)} {...props} />
);
ModalHeader.displayName = 'ModalHeader';

const modalTitleStyles = tv({
	base: 'text-lg font-semibold leading-none tracking-tight',
});

const ModalTitle = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Title ref={ref} className={cn(modalTitleStyles(), className)} {...props} />
));
ModalTitle.displayName = DialogPrimitive.Title.displayName;

const modalDescriptionStyles = tv({
	base: 'text-sm text-muted-foreground',
});

const ModalDescription = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Description
		ref={ref}
		className={cn(modalDescriptionStyles(), className)}
		{...props}
	/>
));
ModalDescription.displayName = DialogPrimitive.Description.displayName;

const modalBodyStyles = tv({
	base: 'flex-1 p-6 pt-0',
});

const ModalBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn(modalBodyStyles(), className)} {...props} />
);
ModalBody.displayName = 'ModalBody';

const modalFooterStyles = tv({
	base: 'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0',
});

const ModalFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn(modalFooterStyles(), className)} {...props} />
);
ModalFooter.displayName = 'ModalFooter';

const ModalClose = DialogPrimitive.Close;
ModalClose.displayName = 'ModalClose';

export {
	Modal,
	ModalBody,
	ModalClose,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	ModalPortal,
	ModalTitle,
	ModalTrigger,
};
