export default {
	/**
	 * The token for the bot
	 */
	token: '',

	/**
	 * The owner/repository to get the doc JSONs from
	 */
	repository: 'dirigeants/klasa',

	/**
	 * The branch that has the JSON documentation files
	 */
	jsonBranch: 'docs',

	/**
	 * The branches to get the JSON from
	 */
	branches: [
		'master',
		'stable',
	],
};
