import DocEntries from '../DocEntries';
import { MessageEmbed } from 'discord.js';

export default abstract class BaseEntry {

	readonly entries: DocEntries;
	readonly name: string;

	constructor(entries: DocEntries, name: string, data: unknown) {
		this.entries = entries;
		this.name = name;

		this._patch(data);
	}

	protected abstract _patch(data: unknown): void;
	abstract generateEmbed(): MessageEmbed;
	abstract get url(): string;

}
