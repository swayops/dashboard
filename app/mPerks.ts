import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';

@Component({
	selector: 'manage-perks',
	templateUrl: './views/mPerks.html'
})
export class PerksCmp extends ManageBase {
	constructor(title: Title, api: Sway) {
		super('getPendingPerks', 'Perks', title, api);
	}
}

@Component({
	selector: 'manage-campaign-perks',
	templateUrl: './views/mPerkCampaigns.html'
})
export class CampaignPerksCmp extends ManageBase {
	constructor(title: Title, api: Sway) {
		super('getPendingPerks', 'Campaign Perks', title, api);
	}
}


@Component({
	selector: 'manage-outbound-perks',
	templateUrl: './views/mOutboundPerks.html'
})
export class OutboundPerksCmp extends ManageBase {
	constructor(title: Title, api: Sway) {
		super('getPendingPerks', 'Campaign Perks', title, api);
	}
}

