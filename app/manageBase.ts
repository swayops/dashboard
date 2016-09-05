import { Component, Input, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway, HasAPI } from './sway';

import { FilterByNameOrID } from './utils';

// TODO make this an actual element and merge all the crap th uses it
export class ManageBase extends HasAPI {
	private list;
	@Input() kw;

	constructor(private apiEndpoint: string, name: string, title: Title, api: Sway, public id?: string) {
		super(api);
		title.setTitle('Sway :: Manage ' + name);
		if(id) {
			this.apiEndpoint += '/' + id;
			api.SetCurrentUser(id);
		}
		this.Reload();
	}

	Edit(uid: string) {
		console.warn('n/i');
	}

	Delete(uid: string) {
		console.warn('n/i');
	}

	Reload(onComplete?: (resp, err?) => void) {
		this.api.Get(this.apiEndpoint, data => {
			this.list = data;
			if(onComplete) onComplete(data, null);
		}, err => onComplete && onComplete(null, err));
	}

	FmtMoney(n: number, cut: number = 2): string {
		if(n == null) return 'N/A';
		return '$' + n.toFixed(cut);
	}

	Num(v: any, def: number = 0): number {
		if(v == null) return def;
		if(Array.isArray(v) || typeof v === 'string') return v.length;
		if(typeof v === 'number') return v;
		return def;
	}

	get FilterUsers() { return (user) => FilterByNameOrID(this.kw, user) }
}
