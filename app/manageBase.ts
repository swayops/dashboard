import { Component, Input, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway, HasAPI } from './sway';

import { FilterByProps, SortBy } from './utils';

// TODO make this an actual element and merge all the crap th uses it
export class ManageBase extends HasAPI {
	public loading = true;
	public list: Object[];
	public lastSortKey: string;

	@Input() kw: string;

	constructor(public apiEndpoint: string, name: string, title: Title, api: Sway, public id?: string,
			cb?: (resp, err?) => void) {
		super(api);

		if (name[0] === '-') { // don't prefix the name with Manage
			name = name.substr(1);
		} else {
			name = 'Manage ' + name;
		}

		title.setTitle('Sway :: ' + name);
		if (id) {
			if (this.apiEndpoint) this.apiEndpoint += '/' + id;
			api.SetCurrentUser(id).then(_ => this.Reload(cb));
		} else {
			this.Reload(cb);
		}
	}

	Edit(it: any) {
		console.warn('n/i');
	}

	Delete(uid: string) {
		console.warn('n/i');
	}

	Reload(onComplete?: (resp, err?) => void) {
		if (!this.apiEndpoint) {
			if (onComplete) onComplete(this.user, null);
			return;
		}
		this.loading = true;
		this.api.Get(this.apiEndpoint, data => {
			this.list = data;
			if (onComplete) onComplete(data, null);
			this.loading = false;
		}, err => onComplete && onComplete(null, err));
	}

	FmtMoney(n: number, cut: number = 2): string {
		if (n == null) return 'N/A';
		return '$' + n.toFixed(cut);
	}

	Num(v: any, def: number = 0): number {
		if (v == null) return def;
		if (Array.isArray(v) || typeof v === 'string') return v.length;
		if (typeof v === 'number') return v;
		return def;
	}

	get FilterUsers() { return (user) => FilterByProps(this.kw, user, 'id', 'name'); }
	get FilterByUserName() { return (user) => FilterByProps(this.kw, user, 'username'); }

	SortBy(key: string) {
		if (key === this.lastSortKey) {
			key = key[0] === '-' ? key.substr(1) : '-' + key;
		}
		this.lastSortKey = key;
		this.list.sort(SortBy(key));
	}

	EditFields(flds: any[]): any[] {
		return flds.map(fld => {
			if (!fld.reqNewOnly) return fld;
			return Object.assign({}, fld, { req: false });
		});
	}

	Copy(o: Object): Object { return Object.assign({}, o); }
}
