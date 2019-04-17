import { Urls } from '../Constants';
const { GH_API, RAW_URL } = Urls;
import BranchDocument from './BranchDocument';
import { ExtendedMap } from '../Util';
import fetch from 'node-fetch';
import Client from '../Client';

export default class Documentation extends ExtendedMap {
	client: Client;
	repository: string;
	jsonBranch: string;
	branches: string[];
	constructor(client: Client, repository: string, jsonBranch: string, branches: string[]) {
		super();
		this.client = client;
		this.repository = repository;
		this.jsonBranch = jsonBranch;
		this.branches = branches;
	}

	async init() {
		const branchInfo = await fetch(`${GH_API}/repos/${this.repository}/branches/${this.jsonBranch}`).then(res => res.json()).catch(() => null);
		if (branchInfo) {
			const branches = (await Promise.all(
				this.branches.map(branch =>
					fetch(`${RAW_URL}/${this.repository}/${this.jsonBranch}/${branch}.json`)
						.then(async res => {
							const json = await res.json();
							return Object.assign(json, { branch });
						})
						.catch(() => null))));
			for (const item of branches) {
				if (!item) continue;
				const doc = new BranchDocument(this, item);
				this.add(item.branch, doc);
			}
			this.keyArray = [...this.keys()];
			this.aliasesKeyArray = [...this.aliasesKeyArray.keys() as unknown as string[]];
			this.client.emit('log', `Successfully loaded ${this.size === 1 ? 'a' : this.size} documentation${this.size !== 1 ? 's' : ''}!`);
		} else {
			this.client.emit('warn', `Couldn't find JSON Branch ${this.jsonBranch} for repository ${this.repository}! Double check and try again!`);
		}
	}
}
