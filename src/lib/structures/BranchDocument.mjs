import levenshtein from 'fast-levenshtein';
import CustomDocument from './custom/CustomDocument';
import ClassDocument from './classes/ClassDocument.mjs';
import Util, { ExtendedMap } from '../Util';

export default class BranchDocument extends ExtendedMap {

	constructor(documentation, data) {
		super();

		this.branch = data.branch;

		this.documentation = documentation;

		this.custom = new Map();
		this.classes = new Map();
		this.typedefs = new Map();
		this.externals = new Map();

		this._patch(data);
	}

	get(item) {
		const foundAlias = this.aliases.get(item);
		if (foundAlias) return foundAlias;
		for (const alias of this.aliasKeyArray) {
			if (levenshtein.get(alias, item) <= 5) return this.aliases.get(alias);
		}
		for (const key of this.keyArray) {
			if (key.test(item)) return this.get(key);
		}
		return undefined;
	}

	_patch(data) {
		for (const [category, value] of Object.entries(data.custom)) {
			const doc = this.aliases.get(category);
			if (doc) {
				doc._patch(value.files);
			} else {
				const newdoc = new CustomDocument(this.documentation, value.files, data.meta.date, category, this.branch);
				this.custom.set(new RegExp(`\\b(?:${Util.generateRegex(category)})\\b`, 'i'), newdoc);
				this.aliases.set(category, newdoc);
			}
		}
		for (const clazz of data.classes) {
			const doc = this.aliases.get(clazz.name);
			if (doc) {
				doc._patch(clazz);
			} else {
				const newdoc = new ClassDocument(this.documentation, clazz, this.branch);
				this.classes.set(new RegExp(`\\b(?:${Util.generateRegex(clazz.name)})\\b`, 'i'), newdoc);
				this.aliases.set(clazz.name, newdoc);
			}
		}
		this.keyArray = [...this.custom.keys(), ...this.externals.keys(), ...this.classes.keys(), ...this.typedefs.keys()];
		this.aliasKeyArray = [...this.aliases.keys()];
	}

}
