import React from "react";
import { tv } from "tailwind-variants";
import { FolderSvgLeft, FolderSvgMedium, FolderSvgRight } from "./FolderSvg";

const cardFolderStyles = tv({
	base: "relative pt-[0.625rem]",
	slots: {
		frame: "pointer-events-none absolute inset-0 flex h-full max-h-8 w-full items-end"
	}
});

export type CardFolderProps = React.HTMLAttributes<HTMLDivElement> & {
	asChild?: boolean;
	className?: string;
};

export const CardFolder = ({ className, children, ...props }: CardFolderProps) => {
	const styles = cardFolderStyles();

	return (
		<div className={styles.base({ className })} {...props}>
			<div className={styles.frame()} aria-hidden>
				<FolderSvgLeft />
				<FolderSvgMedium />
				<FolderSvgRight />
			</div>

			{children}
		</div>
	);
};

CardFolder.displayName = "CardFolder";
