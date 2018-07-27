import { Urls } from '../Constants';
const { GH_API, RAW_URL } = Urls;
import BranchDocument from './BranchDocument';
import Util, { ExtendedMap } from '../Util';
import fetch from 'node-fetch';

export default class Documentation extends ExtendedMap {

	constructor(client, repository, jsonBranch, branches) {
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
						.catch(() => null))))
				.filter(i => !!i);
			for (const item of branches) {
				const doc = new BranchDocument(this, item);
				this.aliases.set(item.branch, doc);
				this.set(new RegExp(`\\b(?:${Util.generateRegex(item.branch)})\\b`, 'i'), doc);
			}
			this.keyArray = [...this.keys()];
			this.aliasKeyArray = [...this.aliases.keys()];
			this.client.emit('log', `Successfully loaded ${this.size === 1 ? 'a' : this.size} documentation${this.size !== 1 ? 's' : ''}!`);
		} else {
			this.client.emit('warn', `Couldn't find JSON Branch ${this.jsonBranch} for repository ${this.repository}! Double check and try again!`);
		}
	}

}
