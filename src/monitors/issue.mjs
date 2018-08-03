import { Monitor } from 'klasa';
import djs from 'discord.js';
import fetch from 'chainfetch';

class Issue extends Monitor {

	constructor(...args) {
		super(...args, {
			ignoreOthers: false,
			ignoreEdits: false
		});

		this.colors = {
			pullRequests: {
				open: 0x2CBE4E,
				closed: 0xCB2431,
				merged: 0x6F42C1
			},
			issues: {
				open: 0xD1D134,
				closed: 0x2D32BE
			}
		};
	}

	async run(message) {
		const exec = Issue.regex.exec(message.content);

		if (exec === null) return;

		const id = exec[1];
		let response;

		try {
			await message.react('🔖');
			await message.awaitReactions((reaction, user) => reaction.emoji.name === '🔖' && user === message.author, {
				time: 30000,
				max: 1,
				errors: ['time']
			});

			let { body: data } = await fetch.get(`https://api.github.com/repos/${this.client.documentation.repository}/pulls/${id}`);

			if (data.message !== 'Not Found') {
				response = this.pullRequest(data);
			} else {
				({ body: data } = await fetch.get(`https://api.github.com/repos/${this.client.documentation.repository}/issues/${id}`));

				if (data.message !== 'Not Found') response = this.issue(data);
			}
		} catch (err) {
			console.log(err);
			// noop
		}

		if (message.deleted) return;

		await message.reactions.removeAll();

		if (!response) return;

		const msg = await message.sendEmbed(response);

		try {
			await msg.react('🗑');
			await msg.awaitReactions((reaction, user) => reaction.emoji.name === '🗑' && user === message.author, {
				time: 60000,
				max: 1,
				errors: ['time']
			});
			await msg.delete();
		} catch (err) {
			if (msg.deleted) return;

			await msg.reactions.removeAll();
		}
	}

	_shared(data) {
		const description = data.body.length > 2048 ? `${data.body.slice(0, 2045)}...` : data.body;

		return new djs.MessageEmbed()
			.setThumbnail('https://raw.githubusercontent.com/dirigeants/klasa-website/master/assets/klasa.png')
			.setAuthor(data.user.login, data.user.avatar_url, data.user.html_url)
			.setTitle(data.title)
			.setURL(data.html_url)
			.setDescription(description)
			.setTimestamp(new Date(data.created_at))
			.addField('__**Status:**__', data.state, true)
			.addField('__**Labels:**__', data.labels.map(label => label.name), true);
	}

	pullRequest(data) {
		const state = data.state === 'closed' && data.merged ? 'merged' : data.state;
		const embed = this._shared(data)
			.setColor(this.colors.pullRequests[state])
			.addField('__**Additions:**__', data.additions, true)
			.addField('__**Deletions:**__', data.deletions, true)
			.addField('__**Commits:**__', data.commits, true)
			.addField('__**Files Changed:**__', data.changed_files, true)
			.setFooter(`Pull Request: ${data.number}`);
		if (data.head.repo && data.state !== 'closed') embed.addField('__**Install With:**__', `\`npm i ${data.head.repo.full_name}#${data.head.ref}\``)
		return embed;
	}

	issue(data) {
		return this._shared(data)
			.setColor(this.colors.issues[data.state])
			.setFooter(`Issue: ${data.number}`);
	}

}

Issue.regex = /(?:^|\s)#(\d+)\b/;

export default Issue;
