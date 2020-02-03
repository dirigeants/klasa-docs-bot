import { Piece, PieceOptions } from 'klasa';
import { DocsProviderStore } from './DocsProviderStore';
import Document from '../docs/Document';
import BaseEntry from '../docs/BaseEntry';

export class DocsProvider<
	P extends BaseEntry,
	S extends BaseEntry,
	M extends BaseEntry,
	E extends BaseEntry,
	Ext extends BaseEntry,
	T extends BaseEntry,
	C extends BaseEntry
> extends Piece {

	fetchURLs: string[];
	entries: Map<string | RegExp, Document<P, S, M, E, Ext, T, C>> = new Map();

	constructor(store: DocsProviderStore, file: string[], directory: string, options: DocsProviderOptions = {}) {
		super(store, file, directory, options);

		/**
		 * URLs to fetch using this provider
		 */
		this.fetchURLs = options.fetch || [];
	}

	parseEntry(d: unknown): void;
	parseEntry(): void {
		throw new Error(`${this.type}::${this.name}: parseEntry must be overwritten`);
	}

	async fetchURL(url: string): Promise<unknown>;
	async fetchURL(): Promise<void> {
		throw new Error(`${this.type}::${this.name}: fetchURL must be overwritten`);
	}

	protected add(value: Document<P, S, M, E, Ext, T, C>): void {
		this.entries.set(value.name, value);
	}

	async init(): Promise<void> {
		for (const url of this.fetchURLs) {
			const data = await this.fetchURL(url);
			this.parseEntry(data);
		}
	}

}

export interface DocsProviderOptions extends PieceOptions {
	fetch?: string[];
}
