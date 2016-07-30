import { Component, Input, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway, HasAPI } from './sway';

import * as U from './utils';

export class ManageBase extends HasAPI {
	private list;
	@Input() kw;

	constructor(apiEndpoint: string, name: string, title: Title, api: Sway) {
		super(api);
		title.setTitle("Sway :: Manage " + name);
		api.Get(apiEndpoint, data => {
			this.list = data;
			if(U.IsEmpty(data)) api.NotFound();
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
