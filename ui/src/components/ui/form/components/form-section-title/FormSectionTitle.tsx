import { tv } from "tailwind-variants";

const formSectionTitle = tv({
	base: "text-md font-semibold"
});

export interface FormSectionTitleProps {
	/** Дочерние элементы */
	children: React.ReactNode;
	/** Дополнительные классы */
	className?: string;
	/**
	 * HTML тег для заголовка
	 * @default "h3"
	 */
	as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

/**
 * Заголовок секции формы
 */
export function FormSectionTitle({ children, className, as: Component = "h3" }: FormSectionTitleProps) {
	return <Component className={formSectionTitle({ className })}>{children}</Component>;
}
