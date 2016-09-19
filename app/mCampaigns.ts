import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';

@Component({
	selector: 'campaigns',
	templateUrl: './views/mCampaigns.html',
})
export class CampaignsCmp extends ManageBase {
	public data = {};
	public fields = [
		{
			title: 'Account Name:', placeholder: 'Your brand or name', input: 'text', name: 'name', req: true,
			pattern: /^..+$/, error: 'Please provide a name',
		},
	];
	public editFields = this.EditFields(this.fields);

	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		super('getCampaignsByAdvertiser', 'Campaigns', title, api, route.snapshot.params['id']);
	}

	save = (data, done) => {
		this.api.Post('signUp', data, resp => {
			let msg = resp.msg;
			if (data.status === 'success') {
				msg = 'Campaign ' + data.name + '(' + resp.id + ') was created successfully!';
			}
			this.AddNotification(resp.status, msg);
			this.Reload();
			done();
		}, err => this.AddNotification('error', err.msg));
	}

	edit = (data, done) => {
		done();
	}
}
