import { DocsGenMeta, FileMeta, EntryType } from '../../utils/SharedTypes';

export interface KlasaDocsJSON {
	meta: DocsGenMeta;
	custom: Record<string, Custom>;
	classes: Classes[];
	typedefs: TypeDefs[];
	externals: Externals[];
	branch: string;
}

// #region Custom
export interface Custom {
	name: string;
	files: Record<string, CustomFile>;
}

export interface CustomFile {
	name: string;
	type: string;
	content: string;
	path: string;
}

// #endregion

export interface Classes {
	name: string;
	description?: string;
	extends?: string[];
	props?: ClassProps[];
	methods?: Methods[];
	events?: Events[];
	meta: FileMeta;
	access?: string;
}

export interface Construct {
	name: string;
	description?: string;
	params: Params[];
}

export interface ClassProps extends Omit<Props, 'optional' | 'default'> {
	meta: FileMeta;
	since?: string;
	readonly?: boolean;
	nullable?: boolean;
	scope?: string;
}

export interface Methods {
	name: string;
	description?: string;
	returns?: EntryType | {
		types: EntryType,
		description?: string,
		nullable?: boolean
	};
	async?: boolean;
	meta: FileMeta;
	since?: string;
	access?: string;
	params?: Params[];
	scope?: string;
	see?: string[];
	examples?: string[];
	generator?: boolean;
}

export interface Events {
	name: string;
	description?: string;
	meta: FileMeta;
	since?: string;
	params?: Params[];
}
// #endregion

// #region Type defs
export interface TypeDefs {
	name: string;
	description?: string;
	type: EntryType;
	props?: Props[];
	meta: FileMeta;
}
// #endregion

// #region Externals
export interface Externals {
	name: string;
	see: string[];
	meta: FileMeta;
}
// #endregion

// #region Common
export interface Props {
	name: string;
	description?: string;
	optional: boolean;
	default: string | boolean | number;
	type: EntryType;
}

export interface Params {
	name: string;
	description?: string;
	optional?: boolean;
	default?: string | boolean | number;
	type: EntryType;
}
// #endregion
