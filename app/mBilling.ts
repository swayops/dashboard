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
	public activeBalance = 0;
	public inactiveBalance = 0;
	public isEditing = false;
	public history: any[];
	public loading = false;
	constructor(title: Title, public api: Sway, route: ActivatedRoute) {
		super('billingInfo', 'Billing', title, api, route.snapshot.params['id'], resp => {
			this.list = null;
			if (!resp || !resp.cc || !resp.cc.cardNumber) {
				this.cc.num = ['', '', '', ''];
				this.isEditing = true;
				return;
			}
			this.cc = Object.assign({}, resp.cc);
			this.activeBalance = resp.activeBalance || 0;
			this.inactiveBalance = resp.inactiveBalance || 0;
			this.formatCC(this.cc);
			this.history = resp.history;
		});
	}

	save(f: any) {
		this.loading = true;
		const adv = Object.assign({}, this.user.advertiser);
		adv.ccLoad = Object.assign({}, this.cc);
		this.formatCC(adv.ccLoad);
		delete adv.blacklist;
		this.api.Put('advertiser/' + this.id, { advertiser: adv }, resp => {
			this.loading = false;
			this.isEditing = false;
			if (resp.status === 'success') {
				this.AddNotification(resp.status, 'Successfully updated your credit card information.');
			} else {
				this.AddNotification(resp.status, this.getErrorMsg(resp));
			}
			this.ScrollToTop();
		}, err => {
			this.AddNotification('error', this.getErrorMsg(err), 0);
			this.ScrollToTop();
			this.loading = false;
		});
	}

	private formatCC(cc: any) {
		if (cc.expMonth) {
			cc.expMonth = Pad(parseInt(cc.expMonth));
		}
		if (typeof cc.cvc === 'number') cc.cvc = cc.cvc.toString();
		if (cc.num) {
			cc.cardNumber = cc.num.join('-');
			cc.expYear = (parseInt(cc.expYear) - 2000).toString();
			delete cc.num;
		} else {
			cc.num = ['', '', '', cc.cardNumber || ''];
			cc.expYear = (parseInt(cc.expYear) + 2000).toString();
		}
		if (typeof cc.expYear === 'number') cc.expYear = cc.expYear.toString();
		console.log(cc);
	}

	checkNext(evt: KeyboardEvent, next: HTMLElement) {
		const key = evt.which - 48;
		const val = (<HTMLInputElement> evt.target).value;
		if (key < 0 || key > 9 || val.length < 4) return;
		next.focus();
	}

	getErrorMsg(resp: any): string {
		console.log(resp.msg, resp.msg.substr(0, 1));
		if (resp.msg.substr(0, 1) === '{') {
			const rerr = JSON.parse(resp.msg) || { message: 'Unknown error' };
			return rerr.message;
		}
		return resp.msg;
	}
}
