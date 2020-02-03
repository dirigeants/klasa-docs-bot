import fetch from 'node-fetch';
import { DocsProvider, DocsProviderOptions } from '../lib/structures/pieces/DocsProvider';
import BaseEntry from '../lib/structures/docs/BaseEntry';
import Document from '../lib/structures/docs/Document';
import { KlasaDocsJSON } from '../lib/structures/klasa/KlasaTypes';
import { applyOptions } from '../lib/utils/Decorators';
import { createFetchURL } from '../lib/utils/Utils';
import { GITHUB } from '../lib/utils/Constants';
import KlasaCustomEntries from '../lib/structures/klasa/custom/KlasaCustomEntries';

const docs = createFetchURL(GITHUB.RAW, {
	branch: 'docs',
	org: 'dirigeants',
	repo: 'klasa',
});

@applyOptions<DocsProviderOptions>({
	fetch: [
		docs('master.json'),
		// docs('settings.json'),
		// docs('v1.0.0-alpha.json'),
	],
})
export default class KlasaDocs extends DocsProvider<BaseEntry, BaseEntry, BaseEntry, BaseEntry, BaseEntry, BaseEntry, KlasaCustomEntries> {

	parseEntry(data: KlasaDocsJSON): void {
		const doc = new Document<BaseEntry, BaseEntry, BaseEntry, BaseEntry, BaseEntry, BaseEntry, KlasaCustomEntries>(data.branch, `https://klasa.js.org/#/docs/klasa/${data.branch}/`);

		for (const [key, value] of Object.entries(data.custom)) {
			const entry = new KlasaCustomEntries(key);
			doc.add('custom', entry);

			entry._patch(value);
		}

		this.add(doc);
	}

	async fetchURL(url: string): Promise<KlasaDocsJSON> {
		return fetch(url)
			.then(res => res.json())
			.then(data => {
				const [,,,,,, branch] = url.split('/');
				const split = branch.split('.');
				split.pop();
				return { ...data, branch: split.join('.') };
			})
			.catch(() => null);
	}

}
