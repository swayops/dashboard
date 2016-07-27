import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';

import * as U from './utils';

@Component({
	selector: 'advertisers',
	template: require('./views/mAdvertisers.html'),
	pipes: [ U.FilterArrayPipe ]
})

export class AdvertisersCmp {
	private advertisers;
	@Input() kw;

	constructor(private title: Title, private api: Sway, route: ActivatedRoute) {
		title.setTitle("Sway :: Manage Advertisers");
		var id = route.snapshot.params['id'];
		if(!id) {
			console.error('bad id', id);
			return;
		}
		this.api.Get('getAdvertisersByAgency/' + id, data => this.advertisers = data, err => console.error(err));
	}

	Edit(uid: string) {
		console.warn('n/a');
	}

	Delete(uid: string) {
		console.warn('n/a');
	}

	get FilterUsers() { return (user) => U.FilterByNameOrID(this.kw, user) }
}
