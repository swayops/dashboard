// MBilling
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { ManageBase } from './manageBase';
import { Sway } from './sway';
import { Pad } from './utils';

declare var $: any;

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
	public planID: number = 0;
	constructor(title: Title, public api: Sway, route: ActivatedRoute) {
		super('billingInfo', 'Billing', title, api, route.snapshot.params['id'], (resp) => this.init(resp));
	}

	save(f: any) {
		this.loading = true;
		const adv = Object.assign({}, this.user.advertiser);
		adv.ccLoad = Object.assign({}, this.cc);
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

	private init(resp: any) {
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

		const adv = this.user.advertiser;
		this.planID = (!!adv && !!adv.planID) ? adv.planID : 0;

	}

	private formatCC(cc: any) {
		if (cc.expMonth) {
			cc.expMonth = Pad(parseInt(cc.expMonth));
		}
		if (typeof cc.cvc === 'number') cc.cvc = cc.cvc.toString();
		if (cc.num) {
			cc.cardNumber = cc.num.join('');
			cc.expYear = (parseInt(cc.expYear) - 2000).toString();
			delete cc.num;
		} else {
			cc.num = ['', '', '', cc.cardNumber || ''];
			cc.expYear = (parseInt(cc.expYear) + 2000).toString();
		}
		if (typeof cc.expYear === 'number') cc.expYear = cc.expYear.toString();
	}

	checkNext(evt: KeyboardEvent, next: HTMLElement) {
		const key = evt.which - 48,
			val = (evt.target as HTMLInputElement).value;

		if (key < 0 || key > 9 || val.length < 4) return;
		next.focus();
	}

	numbersOnly(evt: KeyboardEvent) {
		const key = evt.which - 48;
		if (key < 0 || key > 9) evt.preventDefault();
	}

	setPlan(id: number, price: any = 0, monthly: boolean = true) {
		this.loading = true;
		const adv = Object.assign({}, this.user.advertiser);
		adv.subLoad = { plan: id, price: parseFloat(price) || 0, isMonthly: monthly };
		this.api.Put('advertiser/' + this.id, { advertiser: adv }, (resp) => {
			this.loading = false;
			this.isEditing = false;
			if (resp.status === 'success') {
				this.AddNotification(resp.status, 'Successfully updated your subscription.');
				this.planID = id;
			} else {
				this.AddNotification(resp.status, resp);
			}
			this.ScrollToTop();
		}, (err) => {
			this.AddNotification('error', err, 0);
			this.ScrollToTop();
			this.loading = false;
		});
	}

	get canSubscribe(): boolean {
		return !!this.user.advertiser && this.user.parentId === '2';
	}

	get canSetEnterprise(): boolean { return this.api.IsAdmin() || this.api.IsAgency(); }
	get canChangePlans(): boolean { return this.planID !== 3 || this.canSetEnterprise; }
}
