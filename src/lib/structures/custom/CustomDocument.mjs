import CustomEntry from './CustomEntry';
import Util, { ExtendedMap } from '../../Util';

export default class CustomDocument extends ExtendedMap {

	constructor(documentation, data, createdAt, parent, branch) {
		super();
		this.documentation = documentation;

		this.createdAt = createdAt;
		this.parent = parent;
		this.branch = branch;

		this._patch(data);
	}

	_patch(data) {
		for (const [key, value] of Object.entries(data)) {
			const entry = new CustomEntry(this.documentation, value.content, this.createdAt, key, this.parent, this.branch, value.name);
			this.aliases.set(key, entry);
			this.aliases.set(value.name, entry);
			this.set(new RegExp(`\\b(?:${Util.generateRegex(key)})\\b`, 'i'), entry);
			this.set(new RegExp(`\\b(?:${Util.generateRegex(value.name)})\\b`, 'i'), entry);
		}
		this.keyArray = [...this.keys()];
		this.aliasKeyArray = [...this.aliases.keys()];
	}

	get default() {
		return this.get(this.aliasKeyArray[0]);
	}

}
