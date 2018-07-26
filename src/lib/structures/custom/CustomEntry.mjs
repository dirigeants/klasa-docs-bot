import marked from 'marked';
const { lexer } = marked;
import Table from 'ascii-table';
import { util } from 'klasa';
const { chunk } = util;
import BaseEntry from '../base/BaseEntry';

export default class extends BaseEntry {

	_patch(string) {
		super._patch(string);
		this.listIndex = 0;
		this.orderedList = false;
		const tokens = lexer(string);
		const totalListEntries = tokens.filter(i => i.type === 'list_item_end').length;
		tokens.forEach((item, i) => {
			if (i === 0 && item.type === 'heading') {
				this.header = item.text;
				return;
			}
			if (item.type === 'paragraph') {
				this.content += `${item.text}`;
			} else if (item.type === 'space') {
				this.content += '\n';
			} else if (item.type === 'blockquote_start') {
				this.content += '\n*';
			} else if (item.type === 'blockquote_end') {
				this.content += '*\n';
			} else if (item.type === 'code') {
				this.content += `\n\`\`\`${item.lang}\n${item.text}\n\`\`\`\n`;
			} else if (item.type === 'heading') {
				this.pages.push({ content: this.content, header: this.header });
				this.content = '';
				this.header = item.text || '';
			} else if (item.type === 'table') {
				const table = new Table()
					// .removeBorder()
					.setHeading(item.header)
					.setHeadingAlign(Table.CENTER)
					// .setAlign(0, Table.CENTER)
					// .setAlign(1, Table.CENTER)
					// .setAlign(2, Table.CENTER)
					// .setAlign(3, Table.CENTER)
					.addRowMatrix(item.cells);
				if (table.toString().length >= 2030) {
					for (const cellChunk of chunk(item.cells, Math.round(item.cells.length / 4))) {
						table.clearRows();
						table.addRowMatrix(cellChunk);
						this.pages.push({ content: `${table}`, header: this.header });
					}
				} else {
					this.pages.push({ content: `${table}`, header: this.header });
				}
			} else if (item.type === 'list_start') {
				this.orderedList = item.ordered;
			} else if (item.type === 'list_item_start') {
				this.content += `${this.orderedList ? `${++this.listIndex}.` : '•'} `;
			} else if (item.type === 'text') {
				this.content += item.text;
			} else if (item.type === 'list_item_end') {
				this.content += `${this.listIndex < totalListEntries ? '\n' : ''}`;
			} else if (item.type === 'hr') {
				this.content += `~~${'-'.repeat(56)}~~`;
			}
		});
		this.pages.push({ content: this.content, header: this.header });
		this.content = '';
		this.header = '';
		this.listIndex = 0;
	}

}
