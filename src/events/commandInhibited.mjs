import { Event } from 'klasa';
import djs from 'discord.js';

export default class extends Event {

	run(msg, command, responses) {
		if (responses && responses.length) {
			const { embed } = this;
			for (let i = 0; i < responses.length; i++) embed.addField(`Reason ${i + 1}:`, responses[i]);
			msg.sendEmbed(embed);
		}
	}

	get embed() {
		return new djs.MessageEmbed()
			.setTitle('Command Inhibited')
			.setThumbnail(this.client.user.avatarURL())
			.setTimestamp();
	}

}
