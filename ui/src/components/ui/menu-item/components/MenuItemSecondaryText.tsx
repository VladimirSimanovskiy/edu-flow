import React from "react";
import { tv } from "tailwind-variants";

const menuItemSecondaryTextStyles = tv({
	base: "truncate text-xs text-muted"
});

type MenuItemTextProps = React.HTMLAttributes<HTMLSpanElement>;

export const MenuItemSecondaryText = ({ className, children, ...props }: MenuItemTextProps) => (
	<span className={menuItemSecondaryTextStyles({ className })} {...props}>
		{children}
	</span>
);

MenuItemSecondaryText.displayName = "MenuItemSecondaryText";
