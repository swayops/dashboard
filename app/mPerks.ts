import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';

@Component({
	selector: 'media-agencies',
	templateUrl: './views/mPerks.html'
})
export class PerksCmp extends ManageBase {
	constructor(title: Title, api: Sway) {
		super('getPendingPerks', 'Perks', title, api);
	}
}
