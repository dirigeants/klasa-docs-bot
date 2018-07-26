import { Urls, REPLACERE } from '../Constants';
const { GH_API, RAW_URL } = Urls;
import BranchDocument from './BranchDocument';
import fetch from 'node-fetch';
import levenshtein from 'fast-levenshtein';

export default class Documentation extends Map {

	constructor(client, repository, jsonBranch, branches) {
		super();
		this.client = client;
		this.repository = repository;
		this.jsonBranch = jsonBranch;
		this.branches = branches;

		/**
		 * Map of branch name -> regexp
		 * @type {Map<string, BranchDocument>}
		 */
		this.aliases = new Map();

		/**
		 * Array of regex keys, to be easily tested over flags
		 */
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

	get(item) {
		const foundAlias = this.aliases.get(item);
		if (foundAlias) return foundAlias;
		for (const alias of this.aliasKeyArray) {
			if (levenshtein.get(alias, item) <= 5) return this.get(alias);
		}
		for (const key of this.keyArray) {
			if (key.test(item)) return this.get(key);
		}
		return undefined;
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
				const doc = new BranchDocument(item);
				this.aliases.set(item.branch, doc);
				this.set(new RegExp(`\\b(?:${item.branch.replace(REPLACERE, (letter, nextWord) => `${letter}+${nextWord ? '\\W*' : ''}`)})\\b`, 'i'), doc);
			}
			this.keyArray = [...this.keys()];
			this.aliasKeyArray = [...this.aliases.keys()];
			this.client.emit('log', `Successfully loaded ${this.size === 1 ? 'a' : this.size} documentation${this.size !== 1 ? 's' : ''}!`);
		} else {
			this.client.emit('warn', `Couldn't find JSON Branch ${this.jsonBranch} for repository ${this.repository}! Double check and try again!`);
		}
	}

}
