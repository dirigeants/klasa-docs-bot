import Document from '../structures/docs/Document';
import BaseEntry from '../structures/docs/BaseEntry';
import { CreateFetchURLOptions } from './SharedTypes';

const primitives: readonly string[] = [
	'object',
	'function',
	'boolean',
	'symbol',
	'error',
	'rangeerror',
	'referenceerror',
	'syntaxerror',
	'typeerror',
	'number',
	'bigint',
	'string',
	'regexp',
	'array',
	'map',
	'set',
	'weakmap',
	'weakset',
	'arraybuffer',
	'promise',
	'proxy',
];

const escapeCharacters = /[<>]/g;

export function generateRegExp(string: string): string {
	return string.replace(/\w(?=(\w)?)/g, (letter, nextWord) => `${letter}+${nextWord ? '\\W*' : ''}`);
}

export function formatStrings<
	P extends BaseEntry,
	S extends BaseEntry,
	M extends BaseEntry,
	E extends BaseEntry,
	Ext extends BaseEntry,
	T extends BaseEntry,
	C extends BaseEntry
>(input: string, entries: Document<P, S, M, E, Ext, T, C>): string {
	// Find all @link / @tutorial and parse them
	entries.baseURL.toLowerCase();
	return input;
}

export function formatExternals<
	P extends BaseEntry,
	S extends BaseEntry,
	M extends BaseEntry,
	E extends BaseEntry,
	Ext extends BaseEntry,
	T extends BaseEntry,
	C extends BaseEntry
>(input: string, entries: Document<P, S, M, E, Ext, T, C>): string {
	// Fetch externals, return array of externals
	entries.baseURL.toLowerCase();
	return input;
}

export function formatTypes<
	P extends BaseEntry,
	S extends BaseEntry,
	M extends BaseEntry,
	E extends BaseEntry,
	Ext extends BaseEntry,
	T extends BaseEntry,
	C extends BaseEntry
>(types: string[][][], entries: Document<P, S, M, E, Ext, T, C>): string {
	const returnString = [];
	const flattenedTypes = types.flat(1);
	let temp = '';
	for (const type of flattenedTypes) {
		if (type.length > 1) {
			for (const string of type) {
				temp += wrapURL(string, entries);
			}
			continue;
		}
		if (temp.length) {
			returnString.push(temp);
			temp = '';
		}
		returnString.push(wrapURL(type[0], entries));
	}

	if (temp.length) returnString.push(temp);
	return returnString.join(' | ');
}

export function wrapURL<
	P extends BaseEntry,
	S extends BaseEntry,
	M extends BaseEntry,
	E extends BaseEntry,
	Ext extends BaseEntry,
	T extends BaseEntry,
	C extends BaseEntry
>(input: string, entries: Document<P, S, M, E, Ext, T, C>): string {
	if (primitives.includes(input.toLowerCase())) return `[**${input}**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/${input})`;
	if (escapeCharacters.test(input)) return input.replace(escapeCharacters, '\\$&');
	try {
		const item = entries.search(input);
		return `[**${item.name}**](${item.url})`;
	} catch {
		return input;
	}
}

export function createFetchURL(base: string, { branch, org, repo }: CreateFetchURLOptions = {}): (filename: string) => string {
	return (filename: string): string => `${base}/${org ? `${org}/` : ''}${repo ? `${repo}/` : ''}${branch ? `${branch}/` : ''}${filename}`;
}
