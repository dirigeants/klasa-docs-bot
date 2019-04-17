import { Command, CommandStore, KlasaClient, KlasaMessage, util } from 'klasa';
import { MessageEmbed } from 'discord.js';

export default class extends Command {
	constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			guarded: true,
			permissionLevel: 8,
			description: 'Updates to the latest master branch and restarts the bot'
		});
	}

	async run(message: KlasaMessage) {
		this.disable();
		let msg;
		try {
			const { stdout } = await util.exec('git pull');
			const cleaned = util.clean(stdout);

			msg = await message.sendEmbed(
				new MessageEmbed()
					.setDescription('__**UPDATE**__')
					.addField('stdout:', util.codeBlock('prolog', cleaned))
			);
			if (!cleaned.startsWith('Already up to date.')) {
				await util.exec('yarn');
				process.exit();
			}
		} catch (err) {
			msg = await message.sendEmbed(
				new MessageEmbed()
					.setDescription('__**UPDATE**__')
					.addField('stderr:', util.codeBlock('prolog', util.clean(err)))
			);
		}

		this.enable();
		return msg;
	}
}
