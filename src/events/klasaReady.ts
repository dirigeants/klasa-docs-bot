import { Event } from 'klasa';
import Client from '../lib/Client';
export default class extends Event {
	once = true;

	async run() {
		await (this.client as Client).documentation.init();
	}
}
