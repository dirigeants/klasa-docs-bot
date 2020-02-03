import Document from './Document';
import { MessageEmbed } from 'discord.js';
import { nonenumerable } from '../../utils/Decorators';

export default abstract class BaseEntry {

	@nonenumerable
	document!: Document<BaseEntry, BaseEntry, BaseEntry, BaseEntry, BaseEntry, BaseEntry, BaseEntry>;

	constructor(readonly name: string) {}

	abstract _patch(data: unknown): void;
	abstract generateEmbed(): MessageEmbed;
	abstract get url(): string;

}
