import React from "react";
import { tv } from "tailwind-variants";

const menuItemTextStyles = tv({
	base: "flex-1 truncate text-sm text-primary-fg"
});

type MenuItemTextProps = React.HTMLAttributes<HTMLSpanElement>;

export const MenuItemText = ({ className, children, ...props }: MenuItemTextProps) => (
	<span className={menuItemTextStyles({ className })} {...props}>
		{children}
	</span>
);

MenuItemText.displayName = "MenuItemText";
