import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';
// import { FormDlg } from './form';
// import * as V from './validators';

@Component({
	selector: 'create-campaign',
	templateUrl: './views/createCampaign.html',
})
export class CreateCampaignCmp extends ManageBase {
	public data = {};
	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		super(null, 'Edit Profile', title, api, null, () => this.init());
	}

	public init() {
		//
	}

	save = (data, done) => {
		console.log(data, done);
	}

}
