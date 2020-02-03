import { Store, Client } from 'klasa';
import { DocsProvider } from './DocsProvider';
import BaseEntry from '../docs/BaseEntry';

export class DocsProviderStore extends Store<string, DocsProvider<BaseEntry, BaseEntry, BaseEntry, BaseEntry, BaseEntry, BaseEntry, BaseEntry>> {

	constructor(client: Client) {
		super(client, 'docsProviders', DocsProvider);
	}

}
