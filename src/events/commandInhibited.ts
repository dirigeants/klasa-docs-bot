import { Event, KlasaMessage, Command } from 'klasa';
import { MessageEmbed } from 'discord.js';

export default class extends Event {
	run(msg: KlasaMessage, command: Command, responses?: string[]) {
		if (responses && responses.length) {
			const { embed } = this;
			for (let i = 0; i < responses.length; i++) embed.addField(`Reason ${i + 1}:`, responses[i]);
			msg.sendEmbed(embed);
		}
	}

	get embed() {
		return new MessageEmbed()
			.setTitle('Command Inhibited')
			.setThumbnail(this.client.user.avatarURL())
			.setTimestamp();
	}
}
