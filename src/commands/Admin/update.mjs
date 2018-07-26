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

	async run(message, [...params]) {
		this.disable();
		const { stdout, stderr } = await util.exec('git pull');

		const msg = await message.sendEmbed(
			new djs.MessageEmbed()
				.setDescription('__**UPDATE**__')
				.addField('stdout:', util.codeBlock('prolog', util.clean(stdout)))
				.addField('stderr:', util.codeBlock('prolog', util.clean(stderr)))
		);

		if (stdout !== 'Already up to date.') process.exit();
		this.enable();
		return msg;
	}

}
