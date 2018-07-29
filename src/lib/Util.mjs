import { REPLACERE } from './Constants';
import levenshtein from 'fast-levenshtein';

const primitives = [
	'Array',
	'string',
	'boolean',
	'number',
	'Function',
	'null',
	'undefined'
];

const escapes = ['<', '>'];

export default class Util {

	constructor() {
		throw new Error(`${this.constructor.name} cannot be instantiated with new.`);
	}

	static generateRegex(string) {
		return string.replace(REPLACERE, (letter, nextWord) => `${letter}+${nextWord ? '\\W*' : ''}`);
	}

	static formatString(string, documentation) {
		// TODO: Find all @link / @tutorial and parse them
		return string;
	}

	static parseExternals(externals, documentation) {
		// Fetch externals, return array of externals
		return externals;
	}

	static formatTypes(types, documentation) {
		const returnString = [];
		types = Util.flattenArray(types);
		let temp = '';
		for (const type of types) {
			if (type.length > 1) {
				for (const string of type) {
					temp += Util.wrapURL(string, documentation);
				}
				continue;
			}
			returnString.push(type[0]);
		}
		if (temp.length) returnString.push(temp);
		return returnString.join(' | ');
	}

	static flattenArray(array) {
		return array.reduce((acc, val) => acc.concat(val), []);
	}

	static wrapURL(string, documentation) {
		if (primitives.includes(string)) return `[**${string}**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/${string})`;
		if (escapes.includes(string)) return `\\${string}`;
		const item = documentation.get(string);
		if (item) return `[**${string}**](${item.url})`;
		return string;
	}

}

export class ExtendedMap extends Map {

	constructor(parent = null) {
		super();

		/**
		 * The parent for this map
		 * @type {?ExternalMap}
		 */
		this.parent = parent;

		/**
		 * Map of aliases for the current entries
		 * @type {Map<string, *>}
		 */
		this.aliases = new Map();

		Object.defineProperties(this, {
			keyArray: {
				enumerable: false,
				value: [],
				writable: true
			},
			aliasKeyArray: {
				enumerable: false,
				value: [],
				writable: true
			}
		});
	}

	/**
	 * Gets an item from the map, checking for aliases or typos.
	 * @param {string} item The item to search for
	 * @returns {*}
	 * @memberof ExtendedMap
	 */
	get(item) {
		const foundAlias = this.aliases.get(item);
		if (foundAlias) return foundAlias;
		for (const alias of this.aliasKeyArray) {
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
		if (this.parent && this.parent instanceof ExtendedMap) this.parent.aliases.set(item, value);
	}

}
