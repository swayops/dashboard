import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';

import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';

import { CountriesAndStates, CountriesAndStatesRev, AlphaCmp, PersistentEventEmitter } from './utils';

declare var $: any;

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
		keywords: [],
	};

	@Output() sidebar: any = {
		errors: [],
	};

	@Output() public forecast: any = {};

	public categories = [];
	public categoryImages = categoryImages;
	public opts: any = {
		isEdit: false,
	};

	@ViewChild('cropper') public cropper: ImageCropperComponent;
	public cropperSettings: CropperSettings;
	public cropData: any = {};

	private geoSel;
	private kwsSel;

	private onCampaignLoaded: PersistentEventEmitter<any> = new PersistentEventEmitter();

	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		super(null, route.snapshot.url[0].path === 'editCampaign' ? '-Edit Campaign' : '-Create Campaign',
			title, api, route.snapshot.params['id']);

		this.api.Get('getCategories', resp => {
			this.categories = (resp || []).sort((a, b) => AlphaCmp(a.cat, b.cat)); // sort by name
		});

		this.api.Get('getKeywords', resp => {
			if (!resp || !resp.keywords) resp = { keywords: [] };
			this.initKeywords(resp.keywords);
			this.onCampaignLoaded.subscribe(v => {
				this.kwsSel.val(v.keywords).change();
			});
		});

		this.api.Get('billingInfo/' + this.id, resp => {
			if (!resp.cc) return;
			this.sidebar.lastFour = resp.cc.cardNumber;
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
		// this.updateSidebar();
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

	get allCats(): boolean {
		if (!this.data.categories) return false;
		let checked = 0;

		for (let [, v] of Object.entries(this.data.categories)) {
			if (v) checked++;
		}

		return checked === this.categories.length;
	}

	setAllCats(evt: any) {
		const chk = getCheckbox(evt);
		if (!chk) return;
		if (!this.data.categories) this.data.categories = {};
		const v = !chk.checked;
		for (let c of this.categories) {
			this.data.categories[c.cat] = v;
		}
		chk.checked = v;
		this.updateSidebar('category');
	}

	updateSidebar(why?: string) {
		let curBudget = 0;
		setTimeout(() => {
			const cats = this.data.categories;
			if (forecastKeys.indexOf(why) > -1) this.updateForecast();

			this.sidebar.reqs = this.getReqs(this.data).join(', ');
			this.sidebar.categories = Object.keys(cats).filter(k => cats[k]).join(', ');
			this.sidebar.networks = networks.filter(n => !!this.data[n.toLowerCase()]).join(', ');
			this.sidebar.geos = (this.geoSel.val() || []).map(k => CountriesAndStatesRev[k]).join(', ');
			if (this.kwsSel) this.sidebar.keywords = (this.kwsSel.val() || []).join(', ');
			if (!!this.data.budget && this.data.budget !== curBudget) {
				curBudget = this.data.budget;
				this.api.Get('getProratedBudget/' + curBudget, resp => this.sidebar.totalCharge = resp.budget);
			}
		}, 100); // has to be delayed otherwise we would have to hack how our checkboxes work..
	}

	ngAfterViewInit() {
		this.initGeo();
		this.updateSidebar('init');

		$(function () {
			let iid, lastScrollTop;

			function a() {
				let scrollTop = $(window).scrollTop();
				if (lastScrollTop === scrollTop) return;

				lastScrollTop = scrollTop;

				let mainTop = $('div[three-column]').offset().top,
					winWidth = $(window).width(),
					ele = $('.right-sb');
				if (winWidth > 768 && scrollTop > mainTop) {
					scrollTop -= mainTop - 10;
				} else {
					scrollTop = 0;
				}

				ele.css({ marginTop: scrollTop });
			}

			iid = setInterval(function () {
				if (!$('create-campaign').length) {
					clearInterval(iid);
					return;
				}
				a();
			}, 100);
			a();
		});
	}

	private initGeo() {
		this.geoSel = $('select.geo').select2({
			data: CountriesAndStates,
			placeholder: 'Select a Country or a State',
			allowClear: true,
			width: '100%',
		});
		this.geoSel.on('select2:select', _ => this.updateSidebar('geo'));
		this.geoSel.on('select2:unselect', _ => this.updateSidebar('geo'));
	}

	private initKeywords(kws: any) {
		const kwData = [];

		for (let k of kws) {
			kwData.push({ id: k, text: k });
		}

		this.kwsSel = $('select.kws').select2({
			data: kwData,
			placeholder: 'Type a keyword to see availability',
			allowClear: true,
			width: '100%',
		});
		this.kwsSel.on('select2:select', _ => this.updateSidebar('kws'));
		this.kwsSel.on('select2:unselect', _ => this.updateSidebar('kws'));
	}

	resetPerks(type: number) {
		this.data.perks = {
			name: '',
			count: 0,
			type: type,
		};
	}

	save = () => {
		if (this.loading) return;
		this.loading = true;
		const data = this.getCmp(this.data);
		if (this.opts.isEdit) {
			this.api.Put('campaign/' + data.id, data, resp => {
				this.loading = false;
				this.AddNotification('success', 'Successfully Edited Campaign!');
				if (data.perks) {
					this.api.GoTo('shippingPerks', this.id);
				} else {
					this.api.GoTo('mCampaigns', this.id);
				}
			}, err => {
				this.loading = false;
				this.AddNotification('error', err.msg);
				this.ScrollToTop();
			});
		} else {
			this.api.Post('campaign', data, resp => {
				this.loading = false;
				this.AddNotification('success', 'Successfully Edited Campaign!');
				if (data.perks && data.perks.type === 1) {
					this.api.GoTo('shippingPerks', this.id);
				} else {
					this.api.GoTo('mCampaigns', this.id);
				}
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

		if (data.whitelist) data.whitelist = Object.keys(data.whitelist).join(', ').trim();

		if (!Array.isArray(data.categories)) data.categories = [];
		if (!!data.categories.length) {
			$('#influencers').click();
		}
		data.categories = (function () { // convert categories to an object
			const out = {};
			data.categories.forEach(v => out[v] = true);
			return out;
		})();
		for (const k of ['tags', 'mention', 'link', 'perks']) {
			this.opts[k] = !!data[k];
		}
		if (data.imageUrl) {
			const img = new Image();
			img.src = data.imageUrl;
			this.cropper.setImage(img);
		}

		if (Array.isArray(data.geos)) {
			this.geoSel.val(data.geos.map(v => v.state ? v.country + '-' + v.state : v.country)).change();
		}

		const hasSocial = data.twitter || data.instagram || data.facebook || data.youtube;
		if (hasSocial || !!data.male || !data.female || !!data.whitelist || !!data.keywords || !!data.geos) {
			// you didn't see this, move on. - A Sith Lord.
			$('#targeting').click();
		}

		this.data = data;

		if (data.perks) {
			$('#perks').click();
		}

		if (!data.perks) this.resetPerks(0);
		if (Array.isArray(data.perks.codes)) {
			data.perks.codes = data.perks.codes.join(' ');
		}
		$
		this.onCampaignLoaded.emit(data);
	}

	private getCmp(data: any): any {
		data = Object.assign({}, data);
		data.perks = Object.assign({}, data.perks);

		if (data.tags && data.tags.length) data.tags = data.tags.split(',').map(v => v.trim());
		if (data.whitelist && data.whitelist.length) {
			const wl = data.whitelist.split(',').map(v => v.trim());
			data.whitelist = {};
			for (let it of wl) data.whitelist[it] = true;
		}

		data.geos = (this.geoSel.val() || []).map(v => {
			const parts = v.split('-'),
				ret: any = { country: parts[0] };
			if (parts.length === 2) ret.state = parts[1];
			return ret;
		});

		if (this.kwsSel) data.keywords = this.kwsSel.val();

		const cats = [];

		for (let [k, v] of Object.entries(data.categories)) {
			if (v) cats.push(k);
		}

		data.categories = cats;
		if (data.perks.codes) {
			data.perks.codes = data.perks.codes.split(/[\s,]+/g).filter(v => !!v.length);
		}
		if (data.perks.name === '') data.perks = null;
		data.imageUrl = null;
		data.imageData = this.cropData.image;

		return data;
	}

	private getReqs(d: any): string[] {
		const reqs = [];
		// Link, @mention, #hashtag, network, product photo
		if (!d.mention && !d.link && !d.tags) reqs.push('link, @mention or #hashtag');
		if (!networks.filter(n => !!d[n.toLowerCase()]).length) reqs.push('network');
		// leaving this because it will be needed sooner or later
		// if (!d.imageData && !d.imageUrl && !this.cropData || !this.cropData.image) reqs.push('product photo');
		return reqs;
	}

	updateForecast() {
		const data = this.getCmp(this.data);
		this.api.Post('getForecast', data, resp => this.forecast = resp || {});
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

// add budget to the list eventually
const forecastKeys = ['init', 'geo', 'network', 'gender', 'whitelist', 'category', 'kws'];
