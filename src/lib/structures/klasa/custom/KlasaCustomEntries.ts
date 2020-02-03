import { MessageEmbed } from 'discord.js';
import BaseEntry from '../../docs/BaseEntry';
import KlasaCustomEntry from './KlasaCustomEntry';
import { Custom } from '../KlasaTypes';
import { Colors, THUMBNAIL } from '../../../utils/Constants';
import { formatStrings } from '../../../utils/Utils';

export default class KlasaCustomEntries extends BaseEntry {

	readonly files: KlasaCustomEntry[] = [];
	urlName = '';

	_patch(data: Custom): void {
		for (const [urlName, value] of Object.entries(data.files)) {
			if (!this.urlName) this.urlName = urlName;
			this.files.push(new KlasaCustomEntry(this.url, urlName, value.name, value.content));
		}
	}

	generateEmbed(): MessageEmbed {
		const url = `${this.url}/${this.urlName}`;

		const embed = new MessageEmbed()
			.setColor(Colors.Info)
			.setTitle(this.name)
			.setURL(url)
			.setThumbnail(THUMBNAIL)
			.setDescription(`This guide page, which can be read [here](${url}) has **${this.files.length}** sub-chapter${this.files.length !== 1 ? 's' : ''}`);

		for (const file of this.files) {
			embed.addField(file.prettyName, file.headings.map(str => `⤷ ${formatStrings(str, this.document)}`).join('\n'));
		}


		return embed;
	}

	get url(): string {
		return `${this.document.baseURL}${encodeURIComponent(this.name)}`;
	}

}
