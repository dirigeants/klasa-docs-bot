import { get as levenshtein } from 'fast-levenshtein';
import BaseEntry from './base/BaseEntry';
import { generateRegExp } from '../../utils/Utils';

type PossibleType = 'props' | 'staticProps' | 'methods' | 'events';

const possibles = [
	'props',
	'staticProps',
	'methods',
	'events',
	'externals',
] as const;

export default class DocEntries {

	readonly name: string;
	readonly baseURL: string;

	props: Map<string | RegExp, BaseEntry> = new Map();
	staticProps: Map<string | RegExp, BaseEntry> = new Map();
	methods: Map<string | RegExp, BaseEntry> = new Map();
	events: Map<string | RegExp, BaseEntry> = new Map();
	externals: Map<string | RegExp, BaseEntry> = new Map();

	constructor(name: string, baseURL: string) {
		this.name = name;
		this.baseURL = baseURL;
	}

	get(search: string): BaseEntry {
		const searchInput = search.trim().toLowerCase();
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

	add(type: PossibleType, value: BaseEntry): void {
		const map = this[type];
		map.set(value.name, value);
		map.set(new RegExp(String.raw`\b(?:${generateRegExp(value.name)})\b`, 'i'), value);
	}

}

