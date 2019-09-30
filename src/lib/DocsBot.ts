import { Client } from 'klasa';
import { DocsProviderStore } from './structures/docs/DocsProviderStore';

Client.defaultClientSchema
	.add('staff', 'user', { array: true });

Client.defaultPermissionLevels
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	.add(8, ({ client, author }) => (client.settings!.get('staff') as string[]).includes(author!.id));

export default class DocsBot extends Client {

	docsProviders: DocsProviderStore;

	constructor() {
		super({
			commandEditing: true,
			commandLogging: true,
			console: { useColor: true },
			createPiecesFolders: false,
			disableEveryone: true,
			pieceDefaults: {
				commands: { deletable: true },
				docsProviders: { enabled: true },
			},
			presence: {
				activity: {
					name: 'documentations',
					type: 'WATCHING',
				},
			},
			regexPrefix: /^(?:klasa )?docs[,!\w]?/i,
			restTimeOffset: 0,
			ws: {
				// eslint-disable-next-line @typescript-eslint/camelcase
				guild_subscriptions: false,
			},
		});

		this.docsProviders = new DocsProviderStore(this);
		this.registerStore(this.docsProviders);
	}

}

declare module 'discord.js' {
	interface WebSocketOptions {
		guild_subscriptions?: boolean;
	}

	interface Client {
		docsProviders: DocsProviderStore;
	}
}

declare module 'klasa' {
	interface PieceDefaults {
		docsProviders?: { enabled: boolean };
	}
}
