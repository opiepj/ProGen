interface StoreOptions {

  /**
   * Pretty print JSON
   */
  pretty ? : boolean;

  /**
   * Type of Database
   */
  type ? : string;

  /**
   * Id to save
   */
  saveId ? : string;
}
declare module 'jfs' {
	export class Store {

		constructor(fileName: string, opts?: StoreOptions);

		delete(id: string, callback?: (err: Error) => void): void;

		all(callback: (err: Error) => void): Object;

		allSync(): Object;

		get(id: string, callback: (err: Error, obj: Object) => void): Object;

		getSync(id: string): Object;

		save(id: string, data: Object, callback: (err: Error) => void): void;

		saveSync(id: string, data: Object): void;

	}
}

