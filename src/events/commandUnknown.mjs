import { Event } from "klasa";

export default class extends Event {
	constructor (...args) {
		super(...args, { enabled: true });
	}

	async run (message, command) {
		const document = message.content.match(/^((?:klasa )?docs(?:,|!| )?)(?:master|stable) (.+)/i)[2];
		console.log(document);
	}
}
