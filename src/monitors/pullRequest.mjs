import { Monitor } from "klasa";
import djs from "discord.js";
import fetch from "node-fetch";

class PullRequest extends Monitor {
	constructor (...args) {
		super(...args, {
			ignoreOthers: false,
			ignoreEdits: false,
		});

		this.colors = {
			open: 0x2CBE4E,
			closed: 0xCB2431,
			merged: 0x6F42C1,
		};
	}

	async run (message) {
		const exec = PullRequest.regex.exec(message.content);

		if (exec === null) return;

		message.react("🔖");
		try {
			await message.awaitReactions((reaction, user) => reaction.emoji.name === "🔖" && !user.bot, {
				time: 30000,
				max: 1,
			});

			const data = await fetch(`https://api.github.com/repos/${this.client.documentation.repository}/pulls/${exec[1]}`)
				.then(res => res.json());

			if (data.message === "Not Found") throw new Error("Not a PR");

			const state = data.state === "closed" && data.merged ? "merged" : data.state;
			const description = data.body.length > 2048 ? `${data.body.slice(2045)}...` : data.body;

			const response = new djs.MessageEmbed()
				.setAuthor(data.user.login, data.user.avatar_url, data.user.url)
				.setTitle(data.title)
				.setURL(data.url)
				.setDescription(description)
				.setThumbnail("https://raw.githubusercontent.com/dirigeants/klasa-website/master/assets/klasa.svg")
				.setTimestamp(new Date(data.created_at))
				.setColor(this.colors[state])
				.addField("__**State:**__", state)
				.addField("__**Additions:**__", data.additions, true)
				.addField("__**Deletions:**__", data.deletions, true)
				.addField("__**Commits:**__", data.commits, true)
				.addField("__**Files Changed:**__", data.changed_files, true)
				.addField("__**Labels:**__", data.labels.map(label => label.name))
				.addField("__**Install With:**__", `\`npm i ${data.head.repo.full_name}#${data.head.ref}\``);

			await message.sendEmbed(response);
		} catch (err) {
			// noop
		}
		return message.reactions.removeAll();
	}

	async init () {
		/*
		 * You can optionally define this method which will be run when the bot starts
		 * (after login, so discord data is available via this.client)
		 */
	}
}

PullRequest.regex = /g#(\d+)/;

export default PullRequest;
