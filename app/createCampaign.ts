import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';
import { FormDlg } from './form';
import * as V from './validators';

@Component({
	selector: 'create-campaign',
	templateUrl: './views/createCampaign.html',
})
export class CreateCampaignCmp extends ManageBase {
	public data: any = {};
	public endpoint: string;

	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		super('campaign/', 'Edit Profile', title, api, route.snapshot.params['id'], () => this.init());
	}

	public init() {
		//
	}

	save = (data, done) => {
		this.api.Put(this.endpoint, data, resp => {
			this.AddNotification(resp.status, resp.status === 'success' ? 'Successfully updated your profile' : resp.msg, 5000);
			this.api.GoTo('reporting', this.user.id);
		}, err => this.AddNotification('error', err, 0));
	}

	resetPass = (data, done) => {
		done();
	}
}
