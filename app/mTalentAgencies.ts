import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';

@Component({
	selector: 'media-agencies',
	templateUrl: './views/mTalentAgencies.html'
})
export class TalentAgenciesCmp  extends ManageBase {
	constructor(title: Title, api: Sway) {
		super('getAllTalentAgencies', 'Talent Agencies', title, api);
	}
}
