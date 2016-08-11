import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';

@Component({
	selector: 'advertisers',
	templateUrl: './views/mAdvertisers.html'
})
export class AdvertisersCmp extends ManageBase {
	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		const id = route.snapshot.params['id'];
		super('getAdvertisersByAgency/' + id, 'Advertisers', title, api);
		api.SetCurrentUser(id);
	}
}
