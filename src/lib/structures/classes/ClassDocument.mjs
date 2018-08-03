import Util, { ExtendedMap } from '../../Util';
import Discord from 'discord.js';

export default class ClassDocument extends ExtendedMap {

	constructor(documentation, clazz) {
		super();
		this.documentation = documentation;

		this.construct = null;

		this.staticProps = new ExtendedMap(this);
		this.props = new ExtendedMap(this);
		this.staticMethods = new ExtendedMap(this);
		this.methods = new ExtendedMap(this);
		this.events = new ExtendedMap(this);

		this.path = `${clazz.meta.path}/${clazz.meta.file}`;

		this._patch(clazz);
	}

	_patch(clazz) {
		this.name = clazz.name;
		this.description = Util.formatString(clazz.description, this.documentation);
		this.extends = Util.parseExternals(clazz.extends, this.documentation);
		this.construct = this._parseConstructor(clazz.construct);

		this.keyArray = [...this.staticProps.keys(), ...this.props.keys(), ...this.staticMethods.keys(), ...this.methods.keys(), ...this.events.keys()];
		this.aliasKeyArray = [...this.aliases.keys()];
	}

	_parseConstructor(construct) {
		if (!construct) return null;
		const embed = this._embedBase.setThumbnail('https://raw.githubusercontent.com/dirigeants/klasa-website/master/assets/klasa.png');
		const constructString = [`new ${construct.name}(`];
		const constructParams = [];
		const fieldDescription = [];

		if (construct.params) {
			for (const param of construct.params) {
				constructParams.push(param.name);
				fieldDescription.push([
					'➥ ',
					param.optional ? '[' : '',
					`**${param.name}**`,
					param.default ? `=${param.default}` : '',
					param.optional ? ']' : '',
					'\n\u200d\t\u200d\t\u200d\t',
					`**Type:** ${Util.formatTypes(param.type, this.documentation)}`
				].join(''));
			}
			constructString.push(constructParams.join(', '));
			constructString.push(');');
		} else {
			constructString[0] = construct.description;
		}

		embed
			.setTitle(`${this.name} :: Constructing this class`)
			.setDescription([
				this.description || '',
				'```js',
				constructString.join(''),
				'```'
			].join('\n'));
		if (fieldDescription.length) embed.addField(`Parameters`, fieldDescription.join('\n'));
		return embed;
	}

	get branch() {
		return this.documentation.branch;
	}

	get url() {
		return `https://klasa.js.org/#/docs/klasa/${encodeURIComponent(this.branch)}/class/${encodeURIComponent(this.name)}`;
	}

	get repoURL() {
		return `https://github.com/dirigeants/klasa/blob/${encodeURIComponent(this.branch)}/${this.path}`;
	}

	get _embedBase() {
		return new Discord.MessageEmbed().setColor(0x3669FA);
	}

}
