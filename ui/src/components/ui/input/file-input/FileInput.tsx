import React, { useRef, useCallback, useState, useEffect } from "react";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { InputGroup, InputGroupButton, InputGroupText } from "../input-group/InputGroup";
import { CircleX, Download } from "lucide-react";
import { tv } from "tailwind-variants";
import { downloadFile } from "@/lib/utils/file/downloadFile";

const fileInputStyles = tv({
	base: "group cursor-pointer",
	slots: {
		action: "opacity-0 group-focus-within:opacity-100 group-hover:opacity-100",
		fileDisplay: "min-w-0 flex-1 truncate bg-transparent px-3 py-2.5 italic text-primary-fg lg:py-2",
		placeholder: "text-muted"
	}
});

/** Упрощенная информация о файле */
export interface FileInfo {
	/** id файла */
	id: number;
	/** Имя файла */
	name: string;
	/** URL для скачивания или просмотра файла */
	url: string;
	/** Размер файла в байтах (опционально) */
	size?: number;
	/** MIME-тип файла (опционально) */
	type?: string;
}

/** Тип файла - либо браузерный File, либо упрощенная FileInfo */
export type FileValue = File | FileInfo | null;

export interface FileInputProps
	extends Omit<React.ComponentProps<"input">, "type" | "onChange" | "value" | "defaultValue"> {
	/** Текущий файл (для controlled режима) */
	value?: FileValue;
	/** Файл по умолчанию (для uncontrolled режима) */
	defaultValue?: FileValue;
	/** Флаг для отображения кнопки очистки значения */
	showClearIcon?: boolean;
	/** Колбэк на изменение файла */
	onChange?: (file: FileValue) => void;
	/** Текст сообщения об ошибке */
	error?: string;
	/** Плейсхолдер для отображения когда файл не выбран */
	placeholder?: string;
	/** Текст кнопки выбора файла */
	chooseButtonText?: string;
}

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
	(
		{
			value,
			defaultValue,
			showClearIcon = true,
			onChange,
			disabled,
			error,
			className,
			placeholder = "File not selected",
			chooseButtonText = "Choose file",
			accept,
			...props
		},
		ref
	) => {
		const styles = fileInputStyles();
		const inputRef = useRef<HTMLInputElement>(null);
		const [internalValue, setInternalValue] = useState<FileValue>(defaultValue || null);

		const mergedRef = useMergeRefs(ref, inputRef);

		// Определяем, находимся ли мы в controlled режиме
		const isControlled = value !== undefined;
		const currentValue = isControlled ? value : internalValue;

		// Синхронизируем внутреннее состояние с defaultValue при изменении
		useEffect(() => {
			if (!isControlled && defaultValue !== undefined) {
				setInternalValue(defaultValue);
			}
		}, [defaultValue, isControlled]);

		const handleFileChange = useCallback(
			(event: React.ChangeEvent<HTMLInputElement>) => {
				const file = event.target.files?.[0] || null;

				if (!isControlled) {
					setInternalValue(file);
				}

				onChange?.(file);
			},
			[onChange, isControlled]
		);

		const handleClear = useCallback(
			(e: React.MouseEvent) => {
				e.stopPropagation();
				if (inputRef.current) {
					inputRef.current.value = "";
				}

				if (!isControlled) {
					setInternalValue(null);
				}

				onChange?.(null);
			},
			[onChange, isControlled]
		);

		const handleChooseFile = useCallback(() => {
			if (!currentValue) {
				inputRef.current?.click();
			}
		}, [currentValue]);

		const handleDownload = useCallback(() => downloadFile(currentValue), [currentValue]);

		const shouldShowClearIcon = showClearIcon && currentValue && !disabled;
		const shouldShowDownloadIcon =
			currentValue && (currentValue instanceof File || (!(currentValue instanceof File) && currentValue.url));

		// Получаем имя файла для отображения
		const getFileName = (fileValue: FileValue): string | null => {
			if (!fileValue) return null;
			if (fileValue instanceof File) {
				return fileValue.name;
			}
			return fileValue.name;
		};

		const fileName = getFileName(currentValue);

		return (
			<InputGroup className={styles.base({ className })} onClick={handleChooseFile}>
				<InputGroupText type="primary">{chooseButtonText}</InputGroupText>

				<div className={styles.fileDisplay()}>
					{fileName ? <span>{fileName}</span> : <span className={styles.placeholder()}>{placeholder}</span>}
				</div>

				{shouldShowClearIcon && (
					<InputGroupButton icon={CircleX} onClick={handleClear} type="button" className={styles.action()} />
				)}

				{shouldShowDownloadIcon && (
					<InputGroupButton
						icon={Download}
						onClick={handleDownload}
						type="button"
						className={styles.action()}
					/>
				)}

				<input
					ref={mergedRef}
					type="file"
					onChange={handleFileChange}
					disabled={disabled}
					accept={accept}
					className="sr-only"
					aria-invalid={!!error}
					{...props}
				/>
			</InputGroup>
		);
	}
);

FileInput.displayName = "FileInput";

export default FileInput;
