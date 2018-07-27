import marked from 'marked';
const { lexer } = marked;
import BaseEntry from '../base/BaseEntry';
import Util from '../../Util';

export default class extends BaseEntry {

	_patch(string) {
		super._patch(string);
		const tokens = lexer(string);
		const headings = [];
		tokens.forEach(item => {
			if (item.type === 'heading') headings.push(item.text);
		});

		this.pages.push({
			content: [
				`The following guide (which you can read [here](${this._generateURL(this.name)})) has the following headings:`,
				'',
				...headings.map(heading => Util.formatString(heading, this.branch, this.documentation)).map(heading => `• **${heading}**`)
			].join('\n')
		});

		this.content = '';
		this.header = '';
		this.listIndex = 0;
	}

}
