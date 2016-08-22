import { Component, Input, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway, HasAPI } from './sway';

import { FilterByNameOrID } from './utils';

export class ManageBase extends HasAPI {
	private list;
	@Input() kw;

	constructor(private apiEndpoint: string, name: string, title: Title, api: Sway) {
		super(api);
		title.setTitle('Sway :: Manage ' + name);
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
	get FilterUsers() { return (user) => FilterByNameOrID(this.kw, user) }
}
