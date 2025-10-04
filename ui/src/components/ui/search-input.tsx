import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input/input/Input';
import { Search } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SearchInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	debounceMs?: number;
	className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
	value,
	onChange,
	placeholder = 'Поиск...',
	debounceMs = 300,
	className,
}) => {
	const [localValue, setLocalValue] = useState(value);

	// Debounced onChange effect
	useEffect(() => {
		const timer = setTimeout(() => {
			if (localValue !== value) {
				onChange(localValue);
			}
		}, debounceMs);

		return () => clearTimeout(timer);
	}, [localValue, onChange, debounceMs, value]);

	// Sync external value changes
	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setLocalValue(e.target.value);
	}, []);

	return (
		<div className={cn('relative', className)}>
			<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				type="text"
				value={localValue}
				onChange={handleInputChange}
				placeholder={placeholder}
				className="pl-10"
			/>
		</div>
	);
};
