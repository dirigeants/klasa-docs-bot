import CustomEntry from './CustomEntry';
import { ExtendedMap } from '../../Util';


export default class CustomDocument extends ExtendedMap {
	documentation: any;
	createdAt: any;
	constructor(documentation, data, createdAt, parent) {
		super();

		this.documentation = documentation;

		this.createdAt = createdAt;
		this.parent = parent;

		this._patch(data);
	}

	_patch(data) {
		for (const [key, value] of Object.entries(data)) {
			const entry = new CustomEntry(this.documentation, value['content'], this.createdAt, key, this.parent, value['name']);
			this.add(key, entry);
			this.add(value['name'], entry);
		}
	}

	get default() {
		return this.get(this.aliasesKeyArray[0]);
	}

	get branch() {
		return this.documentation.branch;
	}
}
