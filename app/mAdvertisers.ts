import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';

import * as U from './utils';

@Component({
	selector: 'advertisers',
	template: require('./views/mAdvertisers.html'),
	pipes: [ U.FilterArrayPipe ]
})

export class AdvertisersCmp extends ManageBase {
	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		var id = route.snapshot.params['id'];
		super('getAdvertisersByAgency/' + id, 'Manage Advertisers', title, api);
	}
}
