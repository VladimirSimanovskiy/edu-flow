export type ItemValue = string | number;

export interface ValuesFilterOptions<T extends ItemValue> {
	onFilterChanged: (inList: boolean, listItems: T[]) => void;
	valueView: (item: T) => string;
	fetchData: (
		page: number,
		searchQuery?: string
	) => Promise<{ values: T[]; fullLoaded: boolean }>;
	initState?: ValuesFilterInitState<T>;
	searchPlaceholder?: string;
	selectAllText?: string;
	loadingText?: string;
}

export interface ValuesFilterInitState<T extends ItemValue> {
	inList: boolean;
	itemsList: T[];
}

export interface CheckboxListState<T extends ItemValue> {
	items: T[];
	toggledItems: T[];
	allChecked: boolean;
	page: number;
	fullLoaded: boolean;
	inProgress: boolean;
	searchQuery: string;
}

export interface SearchInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	debounceMs?: number;
}

export interface CheckboxListProps<T extends ItemValue> {
	items: T[];
	toggledItems: T[];
	allChecked: boolean;
	inProgress: boolean;
	fullLoaded: boolean;
	valueView: (item: T) => string;
	selectAllText: string;
	loadingText: string;
	onToggleAll: () => void;
	onToggleItem: (item: T) => void;
	onLoadMore: () => void;
	isChecked: (item: T) => boolean;
}
