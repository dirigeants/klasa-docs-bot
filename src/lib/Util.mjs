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

	static formatString(string, branch, documentation) {
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
		return escapes.includes(string) ? `\\${string}` : string;
	}

}

export class ExtendedMap extends Map {

	constructor(...args) {
		super(...args);

		this.aliases = new Map();

		/**
		 * Array of regex keys, to be easily tested over flags
		 */
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


	get(item) {
		const foundAlias = this.aliases.get(item);
		if (foundAlias) return foundAlias;
		for (const alias of this.aliasKeyArray) {
			if (levenshtein.get(alias, item) <= 5) return this.aliases.get(alias);
		}
		for (const key of this.keyArray) {
			if (key.test(item)) return super.get(key);
		}
		return undefined;
	}

}
