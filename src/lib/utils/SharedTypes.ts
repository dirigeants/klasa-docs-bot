export interface DocsGenMeta {
	generator: string;
	format: number;
}

export interface FileMeta {
	line: number;
	file: string;
	path: string;
}

export type EntryType = Array<Array<Array<string>>>;

export interface CreateFetchURLOptions {
	org?: string;
	repo?: string;
	branch?: string;
}
