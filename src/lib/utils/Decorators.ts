import { Piece, PieceOptions, Store } from 'klasa';
import { Constructor } from 'discord.js';

export function applyOptions<T extends PieceOptions>(options: T): Function {
	return (target: Constructor<Piece>): typeof Piece => class extends target {

		constructor(store: Store<string, Piece, typeof Piece>, file: string[], directory: string) {
			super(store, file, directory, options);
		}

	};
}

export function nonenumerable(object: unknown, propertyKey: string | symbol): void {
	const descriptor = Object.getOwnPropertyDescriptor(object, propertyKey) || {};
	descriptor.set = function set(val): void {
		Object.defineProperty(this, propertyKey, {
			value: val,
			writable: true,
			enumerable: false,
		});
	};
	descriptor.enumerable = false;
	Object.defineProperty(object, propertyKey, descriptor);
}
