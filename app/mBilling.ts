// MBilling
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { ManageBase } from './manageBase';
import { Sway } from './sway';
import { Pad } from './utils';

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
			if (!resp || !resp.cc || !resp.cc.cardNumber) {
				this.cc.num = ['', '', '', ''];
				this.isEditing = true;
				return;
			}
			this.cc = resp.cc;
			this.formatCC(this.cc);
			this.history = resp.history;
		});
	}

	save(f: any) {
		console.log(f);
		const adv = Object.assign({}, this.user.advertiser);
		adv.ccLoad = Object.assign({}, this.cc);
		this.formatCC(adv.ccLoad);
		delete adv.blacklist;
		this.api.Put('advertiser/' + this.id, { advertiser: adv }, resp => {
			console.log(resp);
		}, err => console.log(err));
	}

	private formatCC(cc: any) {
		if (cc.expMonth) {
			cc.expMonth = Pad(parseInt(cc.expMonth));
		}
		if (typeof cc.expYear === 'number') cc.expYear = cc.expYear.toString();
		if (typeof cc.cvc === 'number') cc.cvc = cc.cvc.toString();
		if (cc.num) {
			cc.cardNumber = cc.num.join('-');
			delete cc.num;
		} else {
			cc.num = ['', '', '', cc.cardNumber || ''];
		}
		console.log(cc);
	}

	checkNext(evt: KeyboardEvent, next: HTMLElement) {
		const key = evt.which - 48;
		const val = (<HTMLInputElement> evt.target).value;
		if (key < 0 || key > 9 || val.length < 4) return;
		next.focus();
	}
}
