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
	public categoryImages = categoryImages;
	public opts: any = {
		isEdit: false,
	};

	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		super(null, route.snapshot.url[0].path === 'editCampaign' ? '-Edit Campaign' : '-Create Campaign',
			title, api, route.snapshot.params['id'], () => this.init());

		this.api.Get('getCategories', resp => {
			this.categories = (resp || []).sort((a, b) => a.cat > b.cat); // sort by name
		});
		this.data.advertiserId = this.id;
		this.opts.isEdit = route.snapshot.url[0].path === 'editCampaign';
		if (this.opts.isEdit) {
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
		if (this.opts.isEdit) {
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

const categoryImages = {
	'food and drink': '/static/img/influencers/foodAndDrink.png',
	'law and politics': '/static/img/influencers/lawAndPolitics.png',
	'news': '/static/img/influencers/news.png',
	'travel': '/static/img/influencers/travel.png',
	'real estate': '/static/img/influencers/realEstate.png',
	'automotive': '/static/img/influencers/automotive.png',
	'family': '/static/img/influencers/family.png',
	'health': '/static/img/influencers/health.png',
	'hobbies': '/static/img/influencers/hobbies.png',
	'science': '/static/img/influencers/science.png',
	'pets': '/static/img/influencers/pets.png',
	'technology': '/static/img/influencers/technology.png',
	'spirituality': '/static/img/influencers/spirituality.png',
	'arts and entertainment': '/static/img/influencers/artsAndEntertainment.png',
	'career': '/static/img/influencers/career.png',
	'personal finance': '/static/img/influencers/personalFinance.png',
	'business': '/static/img/influencers/business.png',
	'home': '/static/img/influencers/home.png',
	'fashion': '/static/img/influencers/fashion.png',
	'shopping': '/static/img/influencers/shopping.png',
	'dating and marriage': '/static/img/influencers/datingAndMarriage.png',
	'sports': '/static/img/influencers/sports.png',
};
