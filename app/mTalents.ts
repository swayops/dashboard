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
		super('getInfluencersByAgency', 'My Talents', title, api, route.snapshot.params['id']);
	}

	contactInfo(inf: any): string {
		return [
			['Email', inf.email],
			['Twitter', inf.twitterUsername],
			['Instagram', inf.instaUsername],
			['Facebook', inf.fbUsername]
		].filter(v => !!v[1]).map(v => v.join(': ')).join('\n');
	}
}
