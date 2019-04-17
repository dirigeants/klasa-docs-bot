import { lexer } from 'marked';
import BaseEntry from '../base/BaseEntry';
import Util from '../../Util';

export default class CustomEntry extends BaseEntry {
	_patch(str) {
		super._patch(str);
		const tokens = lexer(str);
		const headings = [];
		tokens.forEach(item => {
			if (item.type === 'heading') headings.push(item.text);
		});

		this.pages.push({
			constent: [
				`The following guide (which you can read [here](${this._generateURL(this.name)})) has the following headings:`,
				'',
				...headings.map(heading => Util.formatString(heading, this.documentation)).map(heading => `• **${heading}**`)
			].join('\n')
		});
	}
}
