import CustomDocument from './custom/CustomDocument';
import ClassDocument from './classes/ClassDocument.mjs';
import { ExtendedMap } from '../Util';

export default class BranchDocument extends ExtendedMap {

	constructor(documentation, data) {
		super();

		this.branch = data.branch;

		this.documentation = documentation;

		this.custom = new ExtendedMap(this);
		this.classes = new ExtendedMap(this);
		this.typedefs = new ExtendedMap(this);
		this.externals = new ExtendedMap(this);

		this._patch(data);
	}

	_patch(data) {
		for (const [category, value] of Object.entries(data.custom)) {
			const doc = this.aliases.get(category);
			if (doc) {
				doc._patch(value.files);
			} else {
				const newdoc = new CustomDocument(this, value.files, data.meta.date, category);
				this.custom.add(category, newdoc);
			}
		}
		// create external class
		// Create typedef class
		for (const clazz of data.classes) {
			const doc = this.classes.get(clazz.name);
			if (doc) {
				doc._patch(clazz);
			} else {
				const newdoc = new ClassDocument(this, clazz);
				this.classes.add(clazz.name, newdoc);
			}
		}
		for (const clazz of data.classes) this.classes.get(clazz.name)._parseConstructor(clazz.construct);
		// patch typedef class
		// patch externals??
		this.keyArray = [...this.custom.keys(), ...this.externals.keys(), ...this.classes.keys(), ...this.typedefs.keys()];
		this.aliasKeyArray = [...this.aliases.keys()];
	}

}
