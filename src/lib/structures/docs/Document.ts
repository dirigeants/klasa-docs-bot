import { get as levenshtein } from 'fast-levenshtein';
import BaseEntry from './BaseEntry';
import { generateRegExp } from '../../utils/Utils';

type PossibleType = 'props' | 'staticProps' | 'methods' | 'events' | 'externals' | 'typedefs' | 'custom';

const possibles = [
	'props',
	'staticProps',
	'methods',
	'events',
	'externals',
	'typedefs',
	'custom',
] as const;

export default class Document<
	P extends BaseEntry,
	S extends BaseEntry,
	M extends BaseEntry,
	E extends BaseEntry,
	Ext extends BaseEntry,
	T extends BaseEntry,
	C extends BaseEntry
> {

	readonly name: string;
	readonly baseURL: string;

	readonly props: Map<string | RegExp, P> = new Map();
	readonly staticProps: Map<string | RegExp, S> = new Map();
	readonly methods: Map<string | RegExp, M> = new Map();
	readonly events: Map<string | RegExp, E> = new Map();
	readonly externals: Map<string | RegExp, Ext> = new Map();
	readonly typedefs: Map<string | RegExp, T> = new Map();
	readonly custom: Map<string | RegExp, C> = new Map();

	constructor(name: string, baseURL: string) {
		this.name = name;
		this.baseURL = baseURL;
	}

	search(input: string): BaseEntry {
		const searchInput = input.trim().toLowerCase();
		const possibleMatches: BaseEntry[] = [];

		for (const possible of possibles) {
			const map = this[possible];
			for (const [key, value] of map.entries()) {
				if (typeof key === 'string') {
					if (searchInput === key.toLowerCase()) return value;
					if (levenshtein(searchInput, key.toLowerCase()) <= 3) possibleMatches.push(value);
				} else if (key.test(searchInput)) {
					return value;
				}
			}
		}

		if (possibleMatches.length) throw `Multiple matches found for \`${searchInput}\` — Be more specific\n\`${possibleMatches.map((value, index) => `${index + 1}: ${value.name}`).join('`\n`')}\``;

		throw `Couldn't find anything for ${searchInput}`;
	}

	add(type: PossibleType, value: P & S & M & E & Ext & T & C): void {
		const map = this[type];
		value.document = this;
		map.set(value.name, value);
		map.set(new RegExp(String.raw`\b(?:${generateRegExp(value.name)})\b`, 'i'), value);
	}

}
