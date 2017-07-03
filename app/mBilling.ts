// MBilling
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { ManageBase } from './manageBase';
import { Sway } from './sway';
import { Pad } from './utils';

declare const $: any;

@Component({
	selector: 'mBilling',
	templateUrl: './views/mBilling.html',
})
export class ManageBillingCmp extends ManageBase {
	public cc: any = {
		num: '',
		type: '',
	};
	public activeBalance = 0;
	public inactiveBalance = 0;
	public isEditing = false;
	public history: any[];
	public loading = false;
	public planID: number = 0;

	constructor(title: Title, public api: Sway, route: ActivatedRoute) {
		super('billingInfo', 'Billing', title, api, route.snapshot.params['id'], (resp) => this.init(resp));
	}

	save(f: any) {
		this.loading = true;
		const adv = { ...this.user.advertiser };
		adv.ccLoad = { ...this.cc };
		this.formatCC(adv.ccLoad);
		delete adv.blacklist;
		this.api.Put('advertiser/' + this.id, { advertiser: adv }, (resp) => {
			this.loading = false;
			this.isEditing = false;
			if (resp.status === 'success') {
				this.AddNotification(resp.status, 'Successfully updated your credit card information.');
			} else {
				this.AddNotification(resp.status, resp);
			}
			this.ScrollToTop();
			this.Reload((r) => this.init(r));
		}, (err) => {
			this.AddNotification('error', err, 0);
			this.ScrollToTop();
			this.loading = false;
		});
	}

	del() {
		this.loading = true;
		const adv = { ...this.user.advertiser };
		adv.ccLoad = { ...this.cc };
		adv.ccLoad.del = true;
		this.api.Put('advertiser/' + this.id, { advertiser: adv }, (resp) => {
			this.loading = false;
			this.isEditing = false;
			if (resp.status === 'success') {
				this.AddNotification(resp.status, 'Successfully removed your credit card information.');
			} else {
				this.AddNotification(resp.status, resp);
			}
			this.ScrollToTop();
			this.Reload((r) => this.init(r));
		}, (err) => {
			this.AddNotification('error', err, 0);
			this.ScrollToTop();
			this.loading = false;
		});
	}

	private init(resp: any) {
		this.list = null;
		if (!resp || !resp.cc || !resp.cc.cardNumber) {
			this.isEditing = true;
			this.cc = { num: '' };
			return;
		}
		this.cc = { ...resp.cc };
		this.activeBalance = resp.activeBalance || 0;
		this.inactiveBalance = resp.inactiveBalance || 0;
		this.formatCC(this.cc);
		this.history = resp.history;

		const adv = this.user.advertiser;
		this.planID = (!!adv && !!adv.planID) ? adv.planID : 0;

	}

	private formatCC(cc: any) {
		if (cc.expMonth) {
			cc.expMonth = Pad(parseInt(cc.expMonth));
		}
		if (typeof cc.cvc === 'number') cc.cvc = cc.cvc.toString();
		if (cc.num) {
			cc.cardNumber = cc.num.replace(/-/g, '');
			cc.expYear = (parseInt(cc.expYear) - 2000).toString();
			delete cc.num;
		} else {
			cc.num = (cc.cardNumber || '');
			cc.expYear = (parseInt(cc.expYear) + 2000).toString();
		}
		if (typeof cc.expYear === 'number') cc.expYear = cc.expYear.toString();
	}

	numbersOnly(evt: KeyboardEvent, updateType = false) {
		const key = evt.which - 48;
		if (key === -3) return; // allow "-"
		if (key < 0 || key > 9) return evt.preventDefault();
		if (updateType) this.cc.type = CreditCard.Type(this.cc.num);
	}

	setPlan(id: number, price: any = 0, monthly: string = 'no') {
		this.loading = true;
		const adv = { ... this.user.advertiser };
		adv.subLoad = { plan: id, price: parseFloat(price) || 0, isMonthly: monthly === 'yes' };
		this.api.Put('advertiser/' + this.id, { advertiser: adv }, (resp) => {
			this.loading = false;
			this.isEditing = false;
			if (resp.status === 'success') {
				this.AddNotification(resp.status, 'Successfully updated your subscription.');
			} else {
				this.AddNotification(resp.status, resp);
			}
			this.ScrollToTop();
			this.Reload((r) => this.init(r));
		}, (err) => {
			this.AddNotification('error', err);
			this.ScrollToTop();
			this.loading = false;
		});
	}

	get canSubscribe(): boolean {
		return !!this.user.advertiser && this.user.parentId === '2';
	}

	get canSetEnterprise(): boolean { return this.api.IsAdmin() || this.api.IsAgency(); }
	get canChangePlans(): boolean { return this.planID !== 3 || this.canSetEnterprise; }

	get validCC(): boolean {
		const len = this.cc.num.replace(/-/g, '').length;
		return this.cc.type !== '' && len >= 13 && len <= 19;
	}
}

class CreditCard {
	private static inst = new CreditCard();
	private ccPrefixes = [
		{ name: 'American Express', pre: [34, 37] },
		{ name: 'Maestro', pre: [5018, 5020, 5038, 5893, 6304, 6759, 6761, 6762, 6763] },
		{ name: 'Discover', pre: [6011, 622, 644, 645, 646, 647, 648, 649, 65] },
		{ name: 'Diners Club - Carte Blanche', pre: [6011, 622, 644, 645, 646, 647, 648, 649, 65] },
		{ name: 'Diners Club - International', pre: [36] },
		{ name: 'Diners Club - USA & Canada', pre: [54] },
		{ name: 'InstaPayment', pre: [637, 638, 639] },
		{ name: 'JCB', pre: [35] },
		{ name: 'Visa', pre: [4] },
		{ name: 'MasterCard', pre: [51, 52, 53, 54, 55].concat(range(222, 272)) },
		{ name: 'Visa Electron', pre: [4026, 417500, 4508, 4844, 4913, 4917] },
	];
	private revPrefixes = {};
	constructor() {
		for (const cc of this.ccPrefixes) {
			for (const pre of cc.pre) {
				this.revPrefixes[pre] = cc;
			}
		}
	}

	// based on http://www.freeformatter.com/credit-card-number-generator-validator.html
	static Type(n: string): string {
		const self = CreditCard.inst;
		if (n === '') return '';
		let v = self.revPrefixes[n.substr(0, 4)];
		if (v != null) return v.name;

		v = self.revPrefixes[n.substr(0, 3)];
		if (v != null) return v.name;

		v = self.revPrefixes[n.substr(0, 2)];
		if (v != null) return v.name;

		v = self.revPrefixes[n.substr(0, 1)];
		if (v != null) return v.name;

		return '';
	}
}

function range(min, max): number[] {
	const out = new Array<number>(max - min);
	for (let i = 0; i < out.length; i++) {
		out[i] = min + i;
	}
	return out;
}
