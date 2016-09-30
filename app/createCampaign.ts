import { Component } from '@angular/core';
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
		advertiserId: null,
		categories: {},
		male: true,
		female: true,
		perks: {
			name: '',
			count: 0,
		},
	};
	public categories = [];
	public opts: any = {};
	private isEdit: boolean;

	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		super(null, route.snapshot.url[0].path === 'editCampaign' ? '-Edit Campaign' : '-Create Campaign',
			title, api, route.snapshot.params['id'], () => this.init());

		this.api.Get('getCategories', resp => {
			this.categories = (resp || []).sort((a, b) => a.cat > b.cat); // sort by name
		});
		this.data.advertiserId = this.id;
		this.isEdit = route.snapshot.url[0].path === 'editCampaign';
		if (this.isEdit) {
			const cid = route.snapshot.params['cid'];
			this.api.Get('campaign/' + cid, resp => this.setCmp(resp));
		}
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
	}

	setCat(evt: any) {
		const chk = getCheckbox(evt);
		if (!chk) return;
		if (!this.data.categories) this.data.categories = {};
		this.data.categories[chk.name] = !chk.checked;
	}

	get allCats(): boolean {
		let checked = true;
		this.categories.forEach(c => checked = checked && this.data.categories[c.cat]);
		return checked;
	}

	setAllCats(evt: any) {
		const chk = getCheckbox(evt);
		if (!chk) return;
		if (!this.data.categories) this.data.categories = {};
		const v = !chk.checked;
		this.categories.forEach(c => this.data.categories[c.cat] = v);
		chk.checked = v;
	}

	get hasCategories(): boolean {
		return true; // this.data && this.data.categories && this.data.categories.length > 0;
	}

	save = () => {
		if (this.loading) return;
		this.loading = true;
		const data = this.getCmp(this.data);
		if (this.isEdit) {
			this.api.Put('campaign/' + data.id, data, resp => {
				this.loading = false;
				this.AddNotification('success', 'Successfully Edited Campaign!');
				this.api.GoTo('/mCampaigns/' + this.id);
			}, err => {
				this.loading = false;
				this.AddNotification('error', err);
			});
		} else {
			this.api.Post('campaign', data, resp => {
				this.loading = false;
				this.AddNotification('success', 'Successfully Edited Campaign!');
				this.api.GoTo('/mCampaigns/' + this.id);
			}, err => {
				this.loading = false;
				this.AddNotification('error', err);
			});
		}
	}

	// fromCmp converts our campaign data to a ui-friendly format
	private setCmp(data: any): any {
		if (Array.isArray(data.tags) && data.tags.length) data.tags = data.tags.join(', ').trim();

		if (Array.isArray(data.whitelist)) data.whitelist = data.whitelist.join(', ').trim();

		if (!Array.isArray(data.categories)) data.categories = [];
		this.opts.cats = !!data.categories.length;
		data.categories = (function () { // convert categories to an object
			const out = {};
			data.categories.forEach(v => out[v] = true);
			return out;
		})();
		for (const k of ['tags', 'mention', 'link']) {
			this.opts[k] = !!data[k];
		}
		this.opts.social = data.twitter || data.instagram || data.facebook || data.youtube;

		if (!data.perks) data.perks = { name: '', count: 0 };
		this.data = data;
	}

	private getCmp(data: any): any {
		data = Object.assign({}, data);
		data.perks = Object.assign({}, data.perks);

		if (data.tags && data.tags.length) data.tags = data.tags.split(',').map(v => v.trim());
		if (data.whitelist && data.whitelist.length) data.whitelist = data.whitelist.split(',').map(v => v.trim());

		const cats = [];

		for (let [k, v] of Object.entries(data.categories)) {
			if (v) cats.push(k);
		}

		data.categories = cats;
		if (data.perks.name === '') data.perks = null;
		return data;
	}
}

function getCheckbox(evt: any) {
	const chk = evt.target.previousElementSibling;
	if (!chk || chk.tagName !== 'INPUT' || !chk.name) return null;
	return chk;
}
