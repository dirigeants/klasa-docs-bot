import { Event, KlasaMessage } from 'klasa';

export default class extends Event {
	async run(message: KlasaMessage) {
		if (!message.content) return null;
		const [, , branch = 'master', path] = message.content.match(/^((?:klasa )?docs(?:,|!| )?) ?(?:(master|stable))? ?(.+)/i);
		console.log(branch, path);
		return null;
	}
}
