import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';

import * as U from './utils';

export class ManageBase {
	private list;
	@Input() kw;

	constructor(apiEndpoint: string, name: string, title: Title, private api: Sway) {
		title.setTitle("Sway :: Manage " + name);
		api.Get(apiEndpoint, data => {
			this.list = data;
			if(U.IsEmpty(data)) api.NotFound();
		}, err => {
			if(err.code === 404) return api.NotFound();
			console.error(err);
		});
	}

	Edit(uid: string) {
		console.warn('n/a');
	}

	Delete(uid: string) {
		console.warn('n/a');
	}

	get FilterUsers() { return (user) => U.FilterByNameOrID(this.kw, user) }
}
