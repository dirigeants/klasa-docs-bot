import { RichDisplay, Timestamp } from 'klasa';
import djs from 'discord.js';
const { MessageEmbed } = djs;

const TS = new Timestamp('DD.MM.YYYY [at] HH:mm:ss');

export default class BaseEntry {

	constructor(string, createdAt, name) {
		this.header = '';
		this.content = '';
		this.pages = [];
		this.listIndex = 0;
		this.orderedList = false;

		this.createdAt = TS.displayUTC(createdAt);
		this.name = name;

		this._patch(string);
	}

	_patch(string) {
		this.header = '';
		this.pages = [];
		this.content = '';
		this.listIndex = 0;
		this.orderedList = false;

		return string;
	}

	generateDisplay(color = 0x3669FA) {
		const embed = new MessageEmbed()
			.setColor(color)
			.setThumbnail('https://cdn.discordapp.com/emojis/354702113147846666.png?v=1')
			.setFooter(`Created ${this.createdAt}`)
			.setTitle(this.name);
		if (this.header.length) embed.setTitle(this.header);
		const display = new RichDisplay(embed);
		display.setFooterPrefix('ℹ Page ');
		for (const { header, content } of this.pages) {
			display.addPage(template => {
				if (header.length) template.setTitle(`${this.name} :: ${header}`);
				template.setDescription(content);
				return template;
			});
		}
		return display;
	}

}
