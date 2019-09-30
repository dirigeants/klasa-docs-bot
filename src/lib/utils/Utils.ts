import DocEntries from '../structures/docs/DocEntries';

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

export function formatStrings(input: string, entries: DocEntries): string {
	// Find all @link / @tutorial and parse them
	return input;
}

export function formatExternals(input: string, entries: DocEntries): string {
	// Fetch externals, return array of externals
	return input;
}

export function formatTypes(types: string[][][], entries: DocEntries): string {
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

export function wrapURL(input: string, entries: DocEntries): string {
	if (primitives.includes(input.toLowerCase())) return `[**${input}**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/${input})`;
	if (escapeCharacters.test(input)) return input.replace(escapeCharacters, '\\$&');
	try {
		const item = entries.get(input);
		return `[**${input}**](${item.url})`;
	} catch {
		return input;
	}
}
