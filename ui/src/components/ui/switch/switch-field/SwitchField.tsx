import * as SwitchPrimitives from '@radix-ui/react-checkbox';
import { tv } from 'tailwind-variants';
import React, { useId } from 'react';
import { FieldLabel } from '@/components/ui/label/field-label';
import { Description } from '@/components/ui/description';
import { Switch } from '../Switch';
import type { SwitchProps } from '../Switch';
import type { VariantsConfig } from '@/lib/utils/variants';

export interface SwitchFieldVariants {
	outline?: boolean;
	alignment?: 'left' | 'right';
	disabled?: boolean;
	error?: boolean;
}

const switchFieldStyles = tv({
	slots: {
		container: 'flex cursor-pointer items-center gap-3',
		textContainer: 'flex flex-col gap-1',
		labelWrapper: 'flex h-4 items-center',
		label: 'cursor-pointer',
		description: 'text-xs',
	},
	variants: {
		outline: {
			true: {
				container: 'rounded-lg p-3 px-4 outline outline-1 outline-secondary-border',
			},
		},
		disabled: {
			true: {
				container: 'cursor-default',
				textContainer: 'opacity-50',
				label: 'cursor-default text-primary-fg',
				description: 'text-muted',
			},
		},
		error: {
			true: {
				label: 'text-status-error',
			},
		},
		alignment: {
			left: {},
			right: {
				container: 'flex-row-reverse space-x-reverse',
			},
		},
		withDescription: { true: { container: 'items-start' } },
	} satisfies VariantsConfig<SwitchFieldVariants & { withDescription?: boolean }>,
	defaultVariants: {
		alignment: 'left',
	},
});

type SwitchFieldProps = SwitchProps &
	SwitchFieldVariants & {
		label?: string | React.ReactNode;
		description?: string;
	};

const SwitchField = React.forwardRef<
	React.ElementRef<typeof SwitchPrimitives.Root>,
	SwitchFieldProps
>(
	(
		{
			className,
			id,
			label,
			alignment: alignment,
			error,
			disabled,
			outline,
			description,
			...props
		},
		ref
	) => {
		const {
			container,
			textContainer,
			label: labelStyles,
			labelWrapper,
			description: descriptionStyles,
		} = switchFieldStyles({
			alignment,
			error,
			disabled,
			outline,
			withDescription: !!description,
		});

		const generatedId = useId();
		const switchId = id || `switch-${generatedId}`;

		return (
			<label htmlFor={switchId} className={container({ class: className })}>
				<Switch disabled={disabled} id={switchId} {...props} ref={ref} />
				{(label || description) && (
					<div className={textContainer()}>
						{label && (
							<div className={labelWrapper()}>
								<FieldLabel htmlFor={switchId} className={labelStyles()}>
									{label}
								</FieldLabel>
							</div>
						)}
						{description && (
							<Description className={descriptionStyles()}>{description}</Description>
						)}
					</div>
				)}
			</label>
		);
	}
);

SwitchField.displayName = 'SwitchField';

export { SwitchField };
