import levenshtein from "fast-levenshtein";
import CustomDocument from "./custom/CustomDocument";
import { REPLACERE } from "../Constants";

export default class BranchDocument {
	constructor (data) {
		this.custom = new Map();
		this.classes = new Map();
		this.typedefs = new Map();
		this.externals = new Map();

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
		// TODO: DO we want custom documents? They break on discord if we use embeds and tables..
		// Either we just link or use non-embedded for it
		for (const [category, value] of Object.entries(data.custom)) {
			const doc = this.aliases.get(category);
			if (doc) {
				doc._patch(value.files);
			} else {
				const newdoc = new CustomDocument(value.files, data.meta.date);
				this.custom.set(new RegExp(`\\b(?:${category.replace(REPLACERE, (letter, nextWord) => `${letter}+${nextWord ? "\\W*" : ""}`)})\\b`, "i"), newdoc);
				this.aliases.set(category, newdoc);
			}
		}
		this.keyArray = [...this.custom.keys(), ...this.externals.keys(), ...this.classes.keys(), ...this.typedefs.keys()];
		this.aliasKeyArray = [...this.aliases.keys()];
	}
}
