// MBilling
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { ManageBase } from './manageBase';
import { Sway } from './sway';

@Component({
	selector: 'mBilling',
	templateUrl: './views/mBilling.html',
})
export class ManageBillingCmp extends ManageBase {
	public cc: any = {};
	public isEditing = false;
	public history: any[];
	constructor(title: Title, public api: Sway, route: ActivatedRoute) {
		super('billingInfo', 'Billing', title, api, route.snapshot.params['id'], resp => {
			this.list = [];
			if (!resp || !resp.cc) {
				this.cc = {};
				return;
			}
			this.cc = resp.cc;
			this.history = resp.history;
		});
	}

	save() {
		console.log(arguments);
	}
}
