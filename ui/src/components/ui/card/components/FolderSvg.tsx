import { tv } from "tailwind-variants";

const SVH_FOLDER_HEIGHT = "calc(100% - 5px)";

const folderSvgStyles = tv({
	base: "stroke-secondary-border"
});

export const FolderSvgLeft = () => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="62" height="100%" fill="none">
			<path
				d="M62.5747 125.5H13.5C6.32031 125.5 0.5 119.68 0.5 112.5L0.5 12.5009C0.5 5.87323 5.87296 0.50055 12.5006 0.500889L47.9439 0.502702C49.7901 0.502797 51.6136 0.923824 53.2503 1.77825C54.6399 2.50376 56.3395 3.41983 57.6085 4.19672C59.5519 5.38647 62.11 5.50052 62.11 5.50052"
				className={folderSvgStyles()}
			/>
		</svg>
	);
};

const folderSvgMediumStyles = tv({
	base: "flex-1 border-y border-secondary-border"
});

export const FolderSvgMedium = () => {
	return <div className={folderSvgMediumStyles()} style={{ height: SVH_FOLDER_HEIGHT }} />;
};

export const FolderSvgRight = () => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="28" height={SVH_FOLDER_HEIGHT} fill="none">
			<path
				d="M-0.319971 0.500366L17.4965 0.500309C23.0194 0.50029 27.4966 4.97745 27.4966 10.5003V108.5C27.4966 115.127 22.124 120.5 15.4966 120.5H-0.319971"
				className={folderSvgStyles()}
			/>
		</svg>
	);
};
