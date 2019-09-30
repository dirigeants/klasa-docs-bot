import { RichDisplay, Timestamp } from 'klasa';
import djs from 'discord.js';
const { MessageEmbed } = djs;

const TS = new Timestamp('DD.MM.YYYY [at] HH:mm:ss');

export default class BaseEntry {

	constructor(documentation, string, createdAt, name, parent, prettyName) {
		this.header = '';
		this.content = '';
		this.pages = [];

		this.documentation = documentation;
		this.createdAt = TS.displayUTC(createdAt);
		this.name = name;
		this.parent = parent;
		this.branch = documentation.branch;
		this.prettyName = prettyName;

		this._patch(string);
	}

	_patch(string) {
		this.header = '';
		this.content = '';
		this.pages = [];

		return string;
	}

	generateDisplay(color = 0x3669FA) {
		const embed = new MessageEmbed()
			.setColor(color)
			.setThumbnail('https://cdn.discordapp.com/emojis/354702113147846666.png?v=1')
			.setFooter(`Created ${this.createdAt}`)
			.setTitle(this.prettyName)
			.setURL(this._generateURL(this.name));
		if (this.header.length) embed.setTitle(this.header);
		const display = new RichDisplay(embed);
		display.setFooterPrefix('ℹ Page ');
		for (const { header, content } of this.pages) {
			display.addPage(template => {
				if (header && header.length) template.setTitle(`${this.prettyName} :: ${header}`);
				template.setDescription(content);
				return template;
			});
		}
		return display;
	}

	_generateURL(link = undefined) {
		return `https://klasa.js.org/#/docs/klasa/${encodeURIComponent(this.branch)}/${encodeURIComponent(this.parent)}${link ? `/${encodeURIComponent(link)}` : ''}`;
	}

}
