import { Component, Input, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway, HasAPI } from './sway';

import * as U from './utils';

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

	get FilterUsers() { return (user) => U.FilterByNameOrID(this.kw, user) }
}
