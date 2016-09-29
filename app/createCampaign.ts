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
	public data: any = {
		categories: {},
	};
	public categories = [];
	public opts = {};
	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		super(null, Object.keys(route.snapshot.params).length === 2 ? 'Edit Campaign' : 'Create Campaign',
			title, api, null, () => this.init());
		this.api.Get('getCategories', resp => this.categories = Object.entries(resp));
	}

	public init() {
		//
	}

	toggleOpts(evt: any) {
		const chk = getCheckbox(evt);
		if (!chk) return;
		const name = chk.name.substr(2).toLowerCase();
		const val = !chk.checked;
		this.opts[name] = val;
		if (val) this.data[name] = '';
	}

	setBool(evt: any) {
		const chk = getCheckbox(evt);
		if (!chk) return;
		this.data[chk.name] = !chk.checked;
		console.log(this.data);
	}

	setCat(evt: any) {
		const chk = getCheckbox(evt);
		if (!chk) return;
		if (!this.data.categories) this.data.categories = {};
		this.data.categories[chk.name] = !chk.checked;
	}

	get hasCategories(): boolean {
		return true; // this.data && this.data.categories && this.data.categories.length > 0;
	}
	save = (data, done) => {
		console.log(data, this.data);
	}

}

function getCheckbox(evt: any) {
		const chk = evt.target.previousElementSibling;
		if (!chk || chk.tagName !== 'INPUT' || !chk.name) return null;
		return chk;
	}
