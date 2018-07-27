import { Command, Stopwatch, Type, util } from 'klasa';
import djs from 'discord.js';
import { inspect } from 'util';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['ev'],
			permissionLevel: 10,
			guarded: true,
			description: 'Evaluates arbitrary Javascript.',
			usage: '<expression:str>'
		});
	}

	async run(message, [code]) {
		const { success, result, inspected, time, type } = await this.eval(message, code);
		const footer = util.codeBlock('ts', type);
		const silent = 'silent' in message.flags;

		const output = new djs.MessageEmbed()
			.setColor(success ? 0x00ff00 : 0xff0000)
			.addField('Evaluates to:', result)
			.addField(`${success ? 'Inspect' : 'Error'}:`, util.codeBlock('js', inspected))
			.addField('Type:', util.codeBlock('ts', type))
			.setFooter(time);

		// Handle errors
		if (!success) {
			if (result && result.stack) this.client.emit('error', result.stack);
			if (!silent) return message.sendMessage(output);
		}

		if (silent) return null;

		// Handle too-long-messages
		if (inspected.length > 1000) {
			if (message.guild && message.channel.attachable) {
				return message.channel.sendFile(Buffer.from(inspected), 'output.txt', message.language.get('COMMAND_EVAL_SENDFILE', time, footer));
			}
			this.client.emit('log', result);
			return message.sendMessage(message.language.get('COMMAND_EVAL_SENDCONSOLE', time, footer));
		}

		// If it's a message that can be sent correctly, send it
		return message.sendEmbed(output);
	}

	// Eval the input
	async eval(message, code) {
		// eslint-disable-next-line no-unused-vars
		const msg = message;
		const stopwatch = new Stopwatch();
		let success, syncTime, asyncTime, result, inspected;
		let thenable = false;
		let type;
		try {
			if (message.flags.async) code = `(async () => { ${code} })();`;
			result = eval(code);
			syncTime = stopwatch.toString();
			type = new Type(result);
			if (util.isThenable(result)) {
				thenable = true;
				stopwatch.restart();
				result = await result;
				asyncTime = stopwatch.toString();
			}
			success = true;
		} catch (error) {
			if (!syncTime) syncTime = stopwatch.toString();
			if (thenable && !asyncTime) asyncTime = stopwatch.toString();
			result = error;
			success = false;
		}

		stopwatch.stop();
		if (success && typeof result !== 'string') {
			inspected = inspect(result, {
				depth: message.flags.depth ? parseInt(message.flags.depth) || 0 : 0,
				showHidden: Boolean(message.flags.showHidden)
			});
		} else {
			inspected = result.stack || result;
		}
		return { success, type, time: this.formatTime(syncTime, asyncTime), inspected, result: util.clean(String(result)) };
	}

	formatTime(syncTime, asyncTime) {
		return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`;
	}

};
