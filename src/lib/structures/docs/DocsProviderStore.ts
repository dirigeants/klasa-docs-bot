import { Store, Client } from 'klasa';
import { DocsProvider } from './DocsProvider';

export class DocsProviderStore extends Store<string, DocsProvider> {

	constructor(client: Client) {
		super(client, 'docsProviders', DocsProvider);
	}

}
