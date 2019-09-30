import { REPLACERE } from './Constants';
import levenshtein from 'fast-levenshtein';

export default class Util {

	static formatString(string, documentation) {
		// TODO: Find all @link / @tutorial and parse them
		return string;
	}

	static formatExternals(externals, documentation) {
		// Fetch externals, return array of externals
		return externals;
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
		if (this.parent instanceof ExtendedMap) this.parent.aliases.set(item, value);
	}

}
