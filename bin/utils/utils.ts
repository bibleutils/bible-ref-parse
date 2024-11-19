import fs from 'fs';

export function prepareDirectory (directory: string): void {
	if (fileOrDirectoryExists(directory)) {
		return;
	}

	fs.mkdirSync(directory, { recursive: true });
}
// Utility function to check if a file exists (to replicate `-f` operator in Perl)
export function fileOrDirectoryExists(path: string): boolean {
	try {
		// Assuming a Node.js environment where `fs` module can be used
		return fs.existsSync(path);
	} catch (err) {
		return false;
	}
}
