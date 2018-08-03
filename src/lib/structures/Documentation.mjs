import { Urls } from '../Constants';
const { GH_API, RAW_URL } = Urls;
import BranchDocument from './BranchDocument';
import { ExtendedMap } from '../Util';
import fetch from 'chainfetch';

export default class Documentation extends ExtendedMap {

	constructor(client, repository, jsonBranch, branches) {
		super();
		this.client = client;
		this.repository = repository;
		this.jsonBranch = jsonBranch;
		this.branches = branches;
	}

	async init() {
		const branchInfo = await fetch.get(`${GH_API}/repos/${this.repository}/branches/${this.jsonBranch}`).catch(() => null);
		if (branchInfo) {
			const branches = (await Promise.all(
				this.branches.map(branch =>
					fetch.get(`${RAW_URL}/${this.repository}/${this.jsonBranch}/${branch}.json`)
						.then(({ body }) => Object.assign(body, { branch }))
						.catch(() => null))))
				.filter(i => !!i);
			for (const item of branches) {
				const doc = new BranchDocument(this, item);
				this.add(item.branch, doc);
			}
			this.keyArray = [...this.keys()];
			this.aliasKeyArray = [...this.aliases.keys()];
			this.client.emit('log', `Successfully loaded ${this.size === 1 ? 'a' : this.size} documentation${this.size !== 1 ? 's' : ''}!`);
		} else {
			this.client.emit('warn', `Couldn't find JSON Branch ${this.jsonBranch} for repository ${this.repository}! Double check and try again!`);
		}
	}

}
