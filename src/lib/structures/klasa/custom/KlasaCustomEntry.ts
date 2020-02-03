import * as marked from 'marked';

export default class KlasaCustomEntry {

	readonly headings: string[] = [];

	constructor(baseURL: string, urlName: string, readonly prettyName: string, content: string) {
		const tokens = marked.lexer(content);

		for (const token of tokens) {
			if (token.type !== 'heading') continue;
			if (token.depth > 2) continue;
			this.headings.push(`[${token.text}](${baseURL}/${urlName}?scrollTo=${marked(token.text).toLowerCase().replace(/[^\w]+/g, '-')})`);
		}
	}

}
