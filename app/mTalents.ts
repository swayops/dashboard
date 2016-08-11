import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';

@Component({
	selector: 'talents',
	templateUrl: './views/mTalents.html'
})
export class TalentsCmp extends ManageBase {
	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		const id = route.snapshot.params['id'];
		super('getInfluencersByAgency/' + id, 'My Talents', title, api);
		api.SetCurrentUser(id);
	}

	contactInfo(inf: any): string {
		return 'n/a'
	}
}
