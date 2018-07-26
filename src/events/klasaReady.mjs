import { Event } from 'klasa';

export default class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: true
		});
	}

	async run() {
		await this.client.documentation.init();
	}

}
