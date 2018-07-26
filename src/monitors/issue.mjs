import { Monitor } from "klasa";
import djs from "discord.js";
import fetch from "node-fetch";

class Issue extends Monitor {
	constructor (...args) {
		super(...args, {
			ignoreOthers: false,
			ignoreEdits: false,
		});

		this.colors = {
			pullRequests: {
				open: 0x2CBE4E,
				closed: 0xCB2431,
				merged: 0x6F42C1,
			},
			issues: {
				open: 0xD1D134,
				closed: 0x2D32BE,
			},
		};
	}

	async run (message) {
		const exec = Issue.regex.exec(message.content);

		if (exec === null) return;

		message.react("🔖");
		try {
			await message.awaitReactions((reaction, user) => reaction.emoji.name === "🔖" && !user.bot, {
				time: 30000,
				max: 1,
			});

			let data = await fetch(`https://api.github.com/repos/${this.client.documentation.repository}/pulls/${exec[1]}`)
				.then(res => res.json());

			if (data.message !== "Not Found") {
				this.pullRequest(message, data);
			} else {
				data = await fetch(`https://api.github.com/repos/${this.client.documentation.repository}/issues/${exec[1]}`)
					.then(res => res.json());

				if (data.message !== "Not Found") this.issue(message, data);
			}
		} catch (err) {
			this.client.emit("error", err);
		}
		return message.reactions.removeAll();
	}

	pullRequest (message, data) {
		const state = data.state === "closed" && data.merged ? "merged" : data.state;
		const description = data.body.length > 2048 ? `${data.body.slice(2045)}...` : data.body;

		const response = new djs.MessageEmbed()
			.setAuthor(data.user.login, data.user.avatar_url, data.user.url)
			.setTitle(data.title)
			.setURL(data.url)
			.setDescription(description)
			.setThumbnail("https://raw.githubusercontent.com/dirigeants/klasa-website/master/assets/klasa.svg")
			.setTimestamp(new Date(data.created_at))
			.setColor(this.colors.pullRequests[state])
			.addField("__**State:**__", state)
			.addField("__**Additions:**__", data.additions, true)
			.addField("__**Deletions:**__", data.deletions, true)
			.addField("__**Commits:**__", data.commits, true)
			.addField("__**Files Changed:**__", data.changed_files, true)
			.addField("__**Labels:**__", data.labels.map(label => label.name))
			.addField("__**Install With:**__", `\`npm i ${data.head.repo.full_name}#${data.head.ref}\``);

		return message.sendEmbed(response);
	}

	issue (message, data) {
		const description = data.body.length > 2048 ? `${data.body.slice(2045)}...` : data.body;

		const response = new djs.MessageEmbed()
			.setAuthor(data.user.login, data.user.avatar_url, data.user.url)
			.setTitle(data.title)
			.setURL(data.url)
			.setDescription(description)
			.setThumbnail("https://raw.githubusercontent.com/dirigeants/klasa-website/master/assets/klasa.svg")
			.setTimestamp(new Date(data.created_at))
			.setColor(this.colors.issues[data.state])
			.addField("__**State:**__", data.state)
			.addField("__**Labels:**__", data.labels.map(label => label.name));

		return message.sendEmbed(response);
	}
}

Issue.regex = /g#(\d+)/;

export default Issue;