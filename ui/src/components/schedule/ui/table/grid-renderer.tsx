import React from 'react';
import type { GridModel, GridCell } from '@/components/schedule/core/types';
import { useDragScroll } from '@/hooks';
import { ScrollShadow } from '@/components/ui/scroll-shadow';

interface GridRendererProps {
	model: GridModel;
	renderCell: (cell: GridCell) => React.ReactNode;
	renderHeader?: (col: { key: string; label: string }) => React.ReactNode;
	className?: string;
	enableDragScroll?: boolean;
	rowHeaderLabel?: string;
	rowHeaderControls?: React.ReactNode;
}

export const GridRenderer: React.FC<GridRendererProps> = ({
	model,
	renderCell,
	renderHeader,
	className,
	enableDragScroll = true,
	rowHeaderLabel,
	rowHeaderControls,
}) => {
	const hasGroups = model.columns.some(c => c.groupKey);
	const dragScroll = useDragScroll({ sensitivity: 1.2 });
	const containerProps = enableDragScroll
		? {
				ref: dragScroll.scrollRef,
				className: [
					'overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 touch-pan-x overscroll-x-contain',
					dragScroll.className,
					className,
				]
					.filter(Boolean)
					.join(' '),
				...dragScroll.eventHandlers,
			}
		: {
				className: [
					'overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 touch-pan-x overscroll-x-contain',
					className,
				]
					.filter(Boolean)
					.join(' '),
			};

	const tableWidthClass = hasGroups ? 'w-auto' : 'w-full';
	const colWidthHeader = hasGroups ? 'w-28 min-w-[7rem] max-w-[7rem]' : 'min-w-[7rem]';
	const colWidthCell = hasGroups ? 'w-28 min-w-[7rem] max-w-[7rem]' : 'min-w-[7rem]';
	const dayColStyle: React.CSSProperties | undefined = hasGroups
		? undefined
		: { width: `${(100 / Math.max(model.columns.length, 1)).toFixed(3)}%` };

	return (
		<div className="relative">
			<div {...containerProps}>
				<table
					className={[tableWidthClass, 'border-separate', 'table-fixed'].join(' ')}
					style={{
						minWidth: `calc(10rem + ${model.columns.length} * 7rem)`,
						borderSpacing: 0,
					}}
				>
					<thead>
						{hasGroups && (
							<tr className="sticky top-0 z-40 bg-white">
								<th
									rowSpan={2}
									className="sticky left-0 top-0 bg-white z-40 text-left align-middle px-2 py-2 w-40 min-w-[10rem] border-r border-b border-gray-300 border-b-gray-200 text-xs sm:text-sm font-medium text-gray-600"
								>
									<div className="flex items-center justify-between gap-2">
										<span>{rowHeaderLabel || '\u00A0'}</span>
										{rowHeaderControls}
									</div>
								</th>
								{(() => {
									const groups = model.columns.reduce<
										Array<{ key: string; label: string; span: number }>
									>((acc, col) => {
										const gk = col.groupKey || '';
										const gl = col.groupLabel || '';
										const last = acc[acc.length - 1];
										if (!last || last.key !== gk) {
											acc.push({ key: gk, label: gl, span: 1 });
										} else {
											last.span += 1;
										}
										return acc;
									}, []);
									return groups.map((g, i) => (
										<th
											key={g.key + g.label}
											colSpan={g.span}
											className={[
												'px-2 py-2 text-sm font-semibold text-gray-700 text-center border-b border-gray-200',
												i > 0 ? 'border-l border-gray-200' : '',
											].join(' ')}
										>
											{g.label}
										</th>
									));
								})()}
							</tr>
						)}
						<tr>
							{!hasGroups && (
								<th className="sticky left-0 top-0 bg-white z-40 text-left px-2 py-2 w-40 min-w-[10rem] border-b border-r border-gray-300 text-xs sm:text-sm font-medium text-gray-600">
									<div className="flex items-center justify-between gap-2">
										<span>{rowHeaderLabel || '\u00A0'}</span>
										{rowHeaderControls}
									</div>
								</th>
							)}
							{model.columns.map((col, idx) => {
								const prev = idx > 0 ? model.columns[idx - 1] : undefined;
								const groupBreak =
									hasGroups && (!prev || prev.groupKey !== col.groupKey);
								return (
									<th
										key={col.key}
										className={[
											'px-2 py-2 text-xs sm:text-sm font-medium text-gray-600 text-center',
											hasGroups ? '' : 'border-b border-gray-200',
											colWidthHeader,
											'whitespace-nowrap min-w-0',
											'border-r last:border-r-0',
											groupBreak ? 'border-l border-gray-200' : '',
										].join(' ')}
										style={dayColStyle}
									>
										{renderHeader ? renderHeader(col) : col.label}
									</th>
								);
							})}
						</tr>
					</thead>
					<tbody>
						{model.rows.map((row, rowIdx) => (
							<tr
								key={row.id}
								className={[
									rowIdx % 2 === 1 ? 'bg-gray-50/40' : '',
									'hover:bg-gray-50',
									'border-b border-gray-200',
									rowIdx === 0 ? 'border-t border-gray-200' : '',
								].join(' ')}
							>
								<td
									className={[
										'sticky left-0 bg-white z-10 px-2 py-2 text-xs sm:text-sm text-gray-700 whitespace-nowrap border-r border-gray-300',
										rowIdx > 0 ? 'border-t border-gray-100' : '',
									].join(' ')}
								>
									{row.label}
								</td>
								{model.columns.map((col, idx) => {
									const cell = model.cells.find(
										c => c.rowId === row.id && c.columnKey === col.key
									) || { rowId: row.id, columnKey: col.key, lessons: [] };
									const prev = idx > 0 ? model.columns[idx - 1] : undefined;
									const groupBreak =
										hasGroups && (!prev || prev.groupKey !== col.groupKey);
									return (
										<td
											key={col.key}
											className={[
												'px-2 py-2 align-top border-r border-gray-100 last:border-r-0 min-w-0',
												rowIdx === 0
													? 'border-t border-gray-200'
													: 'border-t border-gray-100',
												colWidthCell,
												groupBreak ? 'border-l border-gray-200' : '',
											].join(' ')}
											style={dayColStyle}
										>
											{renderCell(cell)}
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{enableDragScroll && (
				<ScrollShadow
					position="left"
					visible={dragScroll.hasLeftShadow}
					className="z-50"
					style={{ left: '10rem' }}
				/>
			)}
		</div>
	);
};
