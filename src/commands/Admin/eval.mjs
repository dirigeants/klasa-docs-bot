import { Command, Stopwatch, Type } from 'klasa';
import { inspect } from 'util';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['ev'],
			permLevel: 10,
			guarded: true,
			description: 'Evaluates arbitrary Javascript.',
			usage: '<expression:str>'
		});
	}

	async run(msg, [code]) {
		const { success, result, inspected, time, type } = await this.eval(msg, code);
		const footer = this.client.methods.util.codeBlock('ts', type);
		const silent = 'silent' in msg.flags;

		const output = new this.client.methods.Embed()
			.setColor(success ? 0x00ff00 : 0xff0000)
			.addField('Evaluates to:', result)
			.addField(`${success ? 'Inspect' : 'Error'}:`, this.client.methods.util.codeBlock('js', inspected))
			.addField('Type:', this.client.methods.util.codeBlock('ts', type))
			.setFooter(time);

		// Handle errors
		if (!success) {
			if (result && result.stack) this.client.emit('error', result.stack);
			if (!silent) return msg.sendMessage(output);
		}

		if (silent) return null;

		// Handle too-long-messages
		if (inspected.length > 1000) {
			if (msg.guild && msg.channel.attachable) {
				return msg.channel.sendFile(Buffer.from(inspected), 'output.txt', msg.language.get('COMMAND_EVAL_SENDFILE', time, footer));
			}
			this.client.emit('log', result);
			return msg.sendMessage(msg.language.get('COMMAND_EVAL_SENDCONSOLE', time, footer));
		}

		// If it's a message that can be sent correctly, send it
		return msg.sendEmbed(output);
	}

	// Eval the input
	async eval(msg, code) {
		const stopwatch = new Stopwatch();
		let success, syncTime, asyncTime, result, inspected;
		let thenable = false;
		let type;
		try {
			if (msg.flags.async) code = `(async () => { ${code} })();`;
			result = eval(code);
			syncTime = stopwatch.friendlyDuration;
			type = new Type(result);
			if (this.client.methods.util.isThenable(result)) {
				thenable = true;
				stopwatch.restart();
				result = await result;
				asyncTime = stopwatch.friendlyDuration;
			}
			success = true;
		} catch (error) {
			if (!syncTime) syncTime = stopwatch.friendlyDuration;
			if (thenable && !asyncTime) asyncTime = stopwatch.friendlyDuration;
			result = error;
			success = false;
		}

		stopwatch.stop();
		if (success && typeof result !== 'string') {
			inspected = inspect(result, {
				depth: msg.flags.depth ? parseInt(msg.flags.depth) || 0 : 0,
				showHidden: Boolean(msg.flags.showHidden)
			});
		} else {
			inspected = result.stack || result;
		}
		return { success, type, time: this.formatTime(syncTime, asyncTime), inspected, result: this.client.methods.util.clean(result) };
	}

	formatTime(syncTime, asyncTime) {
		return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`;
	}

}
