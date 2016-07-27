import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';

import * as U from './utils';

@Component({
	selector: 'media-agencies',
	template: require('./views/mAgencies.html'),
	pipes: [ U.FilterArrayPipe ]
})

export class MediaAgenciesCmp {
	private agencies;
	@Input() kw;

	constructor(private title: Title, private api: Sway) {
		title.setTitle("Sway :: Manage Media Agencies");
		api.Get('getAllAdAgencies', data => this.agencies = data, err => console.error(err));
	}

	Edit(uid: string) {
		console.warn('n/a');
	}

	Delete(uid: string) {
		console.warn('n/a');
	}

	get FilterUsers() { return (user) => U.FilterByNameOrID(this.kw, user) }

	get TsToDate() {
		return U.TsToDate;
	}
}
