import { Timestamp } from 'klasa';

export const GITHUB = {
	API: 'https://api.github.com',
	RAW: 'https://raw.githubusercontent.com',
} as const;

export const DISPLAY_TIMESTAMP = new Timestamp('DD.MM.YYYY [at] HH:mm:ss');

export const enum Colors {
	Info = 0x3669FA,
}

export const THUMBNAIL = 'https://cdn.discordapp.com/emojis/354702113147846666.png?v=1';
