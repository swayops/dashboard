import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';

@Component({
	selector: 'manage-campaign-perks',
	templateUrl: './views/mCampaignPerks.html',
})
export class CampaignPerksCmp extends ManageBase {
	constructor(title: Title, api: Sway) {
		super('getPendingCampaigns', 'Campaign Perks', title, api);
	}

	received(id: string) {
		this.api.Get('approveCampaign/' + id, (resp) => {
			this.AddNotification(resp.status, resp.status === 'error' ? resp.message : 'Approved!');
			this.Reload();
		});
	}
}


@Component({
	selector: 'manage-outbound-perks',
	templateUrl: './views/mOutboundPerks.html',
})
export class OutboundPerksCmp extends ManageBase {
	public loading = false;
	constructor(title: Title, api: Sway) {
		super('getPendingPerks', 'Outbound Perks', title, api);
	}

	address(inf: { address: any }) {
		const addr = inf.address;
		if (!addr) return 'N/A';
		return [
			addr.address_line1, addr.address_line2, addr.address_city, addr.address_state,
			addr.address_zip, addr.address_country,
		].filter(v => !!v && v.length).join(', ');
	}

	Sent(cmpID: string, infID: string) {
		this.loading = true;
		this.api.Get('approvePerk/' + infID + '/' + cmpID, resp => {
			this.loading = false;
			this.Reload();
			this.AddNotification('success', 'Approved!', 5000);
			this.ScrollToTop();
		}, err => {
			this.loading = false;
			this.AddNotification('error', err.msg);
		});
	}

	Reject(infID: string, cmpID: string, dealID: string) {
		this.loading = true;
		this.api.Get('unassignDeal/' + infID + '/' + cmpID + '/' + dealID, resp => {
			this.loading = false;
			this.Reload();
			this.AddNotification('success', 'Approved!', 5000);
			this.ScrollToTop();
		}, err => {
			this.loading = false;
			this.AddNotification('error', err.msg);
		});
	}
}

