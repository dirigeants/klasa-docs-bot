import { Event } from "klasa";

export default class extends Event {
	constructor (...args) {
		super(...args, { enabled: true });
	}

	async run (message, command) {
		console.log(message.content.substring(message.prefixLength));
	}
}
