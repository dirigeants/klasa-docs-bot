import { Command, util } from 'klasa';
import djs from 'discord.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			permissionLevel: 8,
			description: 'Updates to the latest master branch and restarts the bot'
		});
	}

	async run(message) {
		this.disable();
		let msg;
		try {
			const { stdout } = await util.exec('git pull');

			msg = await message.sendEmbed(
				new djs.MessageEmbed()
					.setDescription('__**UPDATE**__')
					.addField('stdout:', util.codeBlock('prolog', util.clean(stdout)))
			);

			if (stdout !== 'Already up to date.') process.exit();
		} catch (err) {
			msg = await message.sendEmbed(
				new djs.MessageEmbed()
					.setDescription('__**UPDATE**__')
					.addField('stderr:', util.codeBlock('prolog', util.clean(err)))
			);
		}
		this.enable();
		return msg;
	}

}
