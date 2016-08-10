import { Component, Input, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway, HasAPI } from './sway';

import { FilterByNameOrID } from './utils';

export class ManageBase extends HasAPI {
	private list;
	@Input() kw;

	constructor(apiEndpoint: string, name: string, title: Title, api: Sway) {
		super(api);
		title.setTitle('Sway :: Manage ' + name);
		api.Get(apiEndpoint, data => {
			this.list = data;
		}, err => {});
	}

	Edit(uid: string) {
		console.warn('n/i');
	}

	Delete(uid: string) {
		console.warn('n/i');
	}

	get FilterUsers() { return (user) => FilterByNameOrID(this.kw, user) }
}
