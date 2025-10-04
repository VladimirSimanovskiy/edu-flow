import * as React from 'react';
import { tv } from 'tailwind-variants';

const tableStyles = tv({
	slots: {
		wrapper: 'relative w-full overflow-auto',
		table: 'w-full caption-bottom text-sm',
	},
});

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
	({ className, ...props }, ref) => {
		const styles = tableStyles();

		return (
			<div className={styles.wrapper()}>
				<table ref={ref} className={styles.table({ className })} {...props} />
			</div>
		);
	}
);

Table.displayName = 'Table';

const tableHeaderStyles = tv({
	base: '[&_tr]:border-b',
});

export const TableHeader = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<thead ref={ref} className={tableHeaderStyles({ className })} {...props} />
));

TableHeader.displayName = 'TableHeader';

const tableBodyStyles = tv({
	base: '[&_tr:last-child]:border-0',
});

export const TableBody = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tbody ref={ref} className={tableBodyStyles({ className })} {...props} />
));

TableBody.displayName = 'TableBody';

const tableFooterStyles = tv({
	base: 'border-t bg-primary/[0.03] font-medium [&>tr]:last:border-b-0',
});

export const TableFooter = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tfoot ref={ref} className={tableFooterStyles({ className })} {...props} />
));

TableFooter.displayName = 'TableFooter';

const tableRowStyles = tv({
	base: 'hover:bg-alpha-high-97 data-[state=selected]:bg-alpha-high-95 data-[state=selected]:hover:bg-alpha-high-92 border-b transition-colors',
});

export const TableRow = React.forwardRef<
	HTMLTableRowElement,
	React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
	<tr ref={ref} className={tableRowStyles({ className })} {...props} />
));

TableRow.displayName = 'TableRow';

const tableHeadStyles = tv({
	base: 'h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
});

export const TableHead = React.forwardRef<
	HTMLTableCellElement,
	React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<th ref={ref} className={tableHeadStyles({ className })} {...props} />
));

TableHead.displayName = 'TableHead';

const tableCellStyles = tv({
	base: 'p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
});

export const TableCell = React.forwardRef<
	HTMLTableCellElement,
	React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<td ref={ref} className={tableCellStyles({ className })} {...props} />
));

TableCell.displayName = 'TableCell';

const tableCaptionStyles = tv({
	base: 'mt-4 text-sm text-muted-foreground',
});

export const TableCaption = React.forwardRef<
	HTMLTableCaptionElement,
	React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
	<caption ref={ref} className={tableCaptionStyles({ className })} {...props} />
));

TableCaption.displayName = 'TableCaption';
