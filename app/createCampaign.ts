import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';

import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';

import { CountriesAndStates, CountriesAndStatesRev, AlphaCmp } from './utils';

@Component({
	selector: 'create-campaign',
	templateUrl: './views/createCampaign.html',
	entryComponents: [ImageCropperComponent],
})
export class CreateCampaignCmp extends ManageBase {
	public data: any = {
		advertiserId: null,
		categories: {},
		male: true,
		female: true,
		status: true,
		facebook: true,
		twitter: true,
		instagram: true,
		youtube: true,
		perks: {
			name: '',
			count: 0,
		},
	};


	public sidebar: any = {
		errors: [],
	};

	public categories = [];
	public categoryImages = categoryImages;
	public opts: any = {
		isEdit: false,
	};

	@ViewChild('cropper') public cropper: ImageCropperComponent;
	public cropperSettings: CropperSettings;
	public cropData: any = {};

	private geoSel;

	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		super(null, route.snapshot.url[0].path === 'editCampaign' ? '-Edit Campaign' : '-Create Campaign',
			title, api, route.snapshot.params['id']);

		this.api.Get('getCategories', resp => {
			this.categories = (resp || []).sort((a, b) => AlphaCmp(a.cat, b.cat)); // sort by name
		});
		this.data.advertiserId = this.id;
		this.opts.isEdit = route.snapshot.url[0].path === 'editCampaign';
		if (this.opts.isEdit) {
			const cid = route.snapshot.params['cid'];
			this.api.Get('campaign/' + cid, resp => this.setCmp(resp));
		}

		this.cropperSettings = Object.assign(new CropperSettings(), {
			keepAspect: true,
			responsive: true,
			canvasWidth: 750,
			canvasHeight: 485,
			croppedWidth: 750,
			croppedHeight: 685,
			noFileInput: true,
			// width: 750,
			// height: 389,
			// minWidth: 750,
			minHeight: 389,
		});
	}

	toggleImage(cancel?: boolean) {
		document.getElementById('selImage').classList.toggle('visible');
		if (cancel) {
			this.cropData.image = null;
			this.cropData.original = new Image();
		}
	}

	setImage(e: any) {
		e.stopPropagation();
		e.preventDefault();

		const image = new Image(),
			file = (e.target.files || e.dataTransfer.files)[0],
			rd = new FileReader(),
			cropper = this.cropper;

		rd.onloadend = (evt: any) => {
			image.src = evt.target.result;
			cropper.setImage(image);
		};

		rd.readAsDataURL(file);
	}

	setAllCats(evt: any) {
		const chk = getCheckbox(evt);
		if (!chk) return;
		if (!this.data.categories) this.data.categories = {};
		const v = !chk.checked;
		this.categories.forEach(c => this.data.categories[c.cat] = v);
		chk.checked = v;
	}

	updateSidebar() {
		setTimeout(() => {
			this.sidebar.categories = Object.keys(this.data.categories || {}).join(', ');
			this.sidebar.networks = networks.filter(n => !!this.data[n.toLowerCase()]).join(', ');
			this.sidebar.geos = (this.geoSel.val() || []).map(k => CountriesAndStatesRev[k]).join(', ');

		}, 100); // has to be delayed otherwise we would have to hack how our checkboxes work..
	}

	ngAfterViewInit() {
		const geoSel = $('select.geo').select2({
			data: CountriesAndStates,
			placeholder: 'Select a Country or a State',
			allowClear: true,
			width: '100%',
		});
		geoSel.on('select2:select', e => {
			let val = $(e.currentTarget).val();
			this.data.geos = val.map(v => {
				const parts = v.split('-'),
					ret: any = { country: parts[0] };
				if (parts.length === 2) ret.state = parts[1];
				return ret;
			});
		});
		this.geoSel = geoSel;
		this.updateSidebar();
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
				this.AddNotification('error', err.msg);
				this.ScrollToTop();
			});
		} else {
			this.api.Post('campaign', data, resp => {
				this.loading = false;
				this.AddNotification('success', 'Successfully Edited Campaign!');
				this.api.GoTo('/mCampaigns/' + this.id);
			}, err => {
				this.loading = false;
				this.AddNotification('error', err.msg);
				this.ScrollToTop();
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
		if (data.imageUrl) {
			const img = new Image();
			img.src = data.imageUrl;
			this.cropper.setImage(img);
		}
		if (!data.perks) data.perks = { name: '', count: 0 };
		if (Array.isArray(data.geos)) {
			this.geoSel.val(data.geos.map(v => v.state ? v.country + '-' + v.state : v.country)).change();
		}

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
		data.imageUrl = null;
		data.imageData = this.cropData.image;

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

const networks = ['Instagram', 'Twitter', 'Youtube', 'Facebook'];
