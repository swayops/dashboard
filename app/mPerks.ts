import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';

@Component({
	selector: 'manage-campaign-perks',
	templateUrl: './views/mCampaignPerks.html'
})
export class CampaignPerksCmp extends ManageBase {
	constructor(title: Title, api: Sway) {
		super('getPendingCampaigns', 'Campaign Perks', title, api);
	}

	received(id: string) {
		this.api.Get('approveCampaign/' + id, (resp) => {
			this.AddNotification(resp.status, resp.status === 'error' ? resp.message : 'Approved!');
			this.Reload()
		});
	}
}


@Component({
	selector: 'manage-outbound-perks',
	templateUrl: './views/mOutboundPerks.html'
})
export class OutboundPerksCmp extends ManageBase {
	constructor(title: Title, api: Sway) {
		super('getPendingPerks', 'Outbound Perks', title, api);
	}
}

