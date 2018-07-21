import levenshtein from "fast-levenshtein";
import CustomEntry from "./CustomEntry";
import { REPLACERE } from "../../Constants";

export default class CustomDocument extends Map {
	constructor (data, createdAt) {
		super();

		this.aliases = new Map();

		/**
		 * Array of regex keys, to be easily tested over flags
		 */
		Object.defineProperties(this, {
			keyArray: {
				enumerable: false,
				value: [],
				writable: true,
			},
			aliasKeyArray: {
				enumerable: false,
				value: [],
				writable: true,
			},
		});

		this.createdAt = createdAt;

		this._patch(data);
	}

	get (item) {
		const foundAlias = this.aliases.get(item);
		if (foundAlias) return foundAlias;
		for (const alias of this.aliasKeyArray) {
			if (levenshtein.get(alias, item) <= 5) return this.get(alias);
		}
		for (const key of this.keyArray) {
			if (key.test(item)) return this.get(key);
		}
	}

	_patch (data) {
		for (const value of Object.values(data)) {
			const entry = new CustomEntry(value.content, this.createdAt, value.name);
			this.aliases.set(value.name, entry);
			this.set(new RegExp(`\\b(?:${value.name.replace(REPLACERE, (letter, nextWord) => `${letter}+${nextWord ? "\\W*" : ""}`)})\\b`, "i"), entry);
		}
		this.keyArray = [...this.keys()];
		this.aliasKeyArray = [...this.aliases.keys()];
	}
}
