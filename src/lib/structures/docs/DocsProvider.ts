import { Piece, PieceOptions } from 'klasa';
import { DocsProviderStore } from './DocsProviderStore';
import DocEntries from './DocEntries';

export class DocsProvider extends Piece {

	fetchURLs: string[];
	private entryMap: Map<string | RegExp, DocEntries> = new Map();

	constructor(store: DocsProviderStore, file: string[], directory: string, options: DocsProviderOptions = {}) {
		super(store, file, directory, options);

		/**
		 * URLs to fetch using this provider
		 */
		this.fetchURLs = options.fetch || [];
	}

	parseEntry<Data extends unknown>(d: Data): void;
	parseEntry(): void {
		throw new Error(`${this.type}::${this.name}: parseEntry must be overwritten`);
	}

	fetchURL(url: string): unknown;
	fetchURL(): void {
		throw new Error(`${this.type}::${this.name}: fetchURL must be overwritten`);
	}

	protected add(value: DocEntries): void {
		this.entryMap.set(value.name, value);
	}

}

export interface DocsProviderOptions extends PieceOptions {
	fetch?: string[];
}
