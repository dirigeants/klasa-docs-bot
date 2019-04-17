import { REPLACERE } from './Constants';
import levenshtein from 'fast-levenshtein';

const primitives: string[] = [
	'Array',
	'string',
	'boolean',
	'number',
	'Function',
	'null',
	'undefined'
];

const escapes: string[] = ['<', '>'];

export default class Util {
	constructor() {
		throw new Error(`${this.constructor.name} cannot be instantiated with new.`);
	}

	static generateRegex(str: string) {
		return str.replace(REPLACERE, (letter, nextWord) => `${letter}+${nextWord ? '\\W*' : ''}`);
	}

	static formatString(str, documentation) {
		// TODO: Find all @link / @tutorial and parse them here
	}

	static parseExternals(externals, documentation) {
		// Fetch externals, return array of externals
		return externals;
	}

	static formatTypes(types: any[], documentation): string {
		const returnString = [];
		types = Util.flattenArray(types);

		let temp = '';
		for (const type of types) {
			if (type.length > 1) {
				for (const str of type) {
					temp += Util.wrapURL(str, documentation);
				}
				continue;
			}
			returnString.push(type[0]);
		}
		if (temp.length) returnString.push(temp);
		return returnString.join(' | ');
	}

	static flattenArray(array: any[]) {
		return array.reduce((acc, val) => acc.concat(val), []);
	}

	static wrapURL(str: string, documentation): string {
		if (primitives.includes(str)) return `[**${str}**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/${str})`;
		if (escapes.includes(str)) return `\\${str}`;
		const item = documentation.get(str);
		if (item) return `[**${str}**](${item.url})`;
		return str;
	}
}

export class ExtendedMap extends Map {
	parent?: ExtendedMap;
	aliases: Map<string, any>;
	aliasesKeyArray: string[];
	keyArray: any[];
	constructor(parent = null) {
		super();

		this.parent = parent;

		this.aliases = new Map();

		Object.defineProperties(this, {
			keyArray: {
				enumerable: false,
				value: [],
				writable: true
			},
			aliasesKeyArray: {
				enumerable: false,
				value: [],
				writable: true
			}
		});
	}

	get(item: string) {
		const foundAlias = this.aliases.get(item);
		if (foundAlias) return foundAlias;
		for (const alias of this.aliasesKeyArray) {
			if (levenshtein.get(alias, item) <= 3) return this.aliases.get(alias);
		}
		for (const key of this.keyArray) {
			if (key.test(item)) return this.get(key);
		}
		return undefined;
	}

	add(item, value) {
		this.set(new RegExp(`\\b(?:${Util.generateRegex(item)})\\b`, 'i'), value);
		this.aliases.set(item, value);
		if (this.parent instanceof ExtendedMap) this.parent.aliases.set(item, value);
	}
}
