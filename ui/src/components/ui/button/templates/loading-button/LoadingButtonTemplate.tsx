import React, { type PropsWithChildren } from "react";
import { tv } from "tailwind-variants";
import { LoaderCircle } from "lucide-react";
import { IconButton } from "../../icon-button/IconButton";
import { Button } from "../../button/Button";
import type { ButtonBaseProps } from "../../button-base/ButtonBase";

const loadingButtonTemplateVariants = tv({
	slots: {
		icon: "animate-spin"
	}
});

export type LoadingButtonTemplateProps = ButtonBaseProps & {
	text?: string;
};

export const LoadingButtonTemplate = React.forwardRef<HTMLButtonElement, PropsWithChildren<LoadingButtonTemplateProps>>(
	({ text, ...props }, ref) => {
		const styles = loadingButtonTemplateVariants();

		if (!text) return <IconButton disabled icon={LoaderCircle} iconClassName={styles.icon()} {...props} />;

		return (
			<Button disabled startIcon={LoaderCircle} iconClassName={styles.icon()} ref={ref} {...props}>
				{text}
			</Button>
		);
	}
);

LoadingButtonTemplate.displayName = "LoadingButtonTemplate";
