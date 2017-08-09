import { Component, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { ManageBase } from './manageBase';
import { Modal } from './modal';
import { Sway } from './sway';

import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';

import { AlphaCmp, CallLimiter, CountriesAndStates, CountriesAndStatesRev, PersistentEventEmitter, Target } from './utils';

declare const $: any;

@Component({
	selector: 'create-audience',
	templateUrl: './views/createAudience.html',
	entryComponents: [ImageCropperComponent],
})
export class CreateAudienceCmp extends ManageBase {
	public data: any = {
		categories: {},
		male: true,
		female: true,
		status: true,
		facebook: true,
		twitter: true,
		instagram: true,
		youtube: true,
		keywords: [],
		members: '',
		followerTarget: new Target(),
		engTarget: new Target(),
		priceTarget: new Target(true),
	};

	private infDataPage: number = 0; // TODO: use this for pagination

	@Output() sidebar: any = {
		errors: [],
	};

	@Output() public forecast: any = { loading: true };
	@Output() public influencers: any[] = [];

	private forecastPagination = {
		start: 0,
		end: 2,
	};

	public categories = [];
	public categoryImages = categoryImages;
	public opts: any = {
		isEdit: false,
	};

	public plan = 3;

	@ViewChild('cropper') public cropper: ImageCropperComponent;
	public cropperSettings: CropperSettings;
	public cropData: any = {};

	private geoSel;
	private kwsSel;

	private onCampaignLoaded: PersistentEventEmitter<any> = new PersistentEventEmitter();

	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		super(null, route.snapshot.url[0].path === 'editAudience' ? '-Edit Audience' : '-Create Audience',
			title, api);

		this.id = route.snapshot.params['id'];

		this.api.Get('getCategories', (resp) => {
			this.categories = (resp || []).sort((a, b) => AlphaCmp(a.cat, b.cat)); // sort by name
		});

		this.data.advertiserId = this.id;
		this.opts.isEdit = route.snapshot.url[0].path === 'editAudience';
		if (this.opts.isEdit) {
			const aid = route.snapshot.params['id'];
			this.api.Get('audience/' + aid, (resp) => {
				this.setCmp(resp[aid]);
				this.updateSidebar('init');
			});
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

		for (const k of Object.keys(this.data.categories)) {
			if (this.data.categories[k]) checked++;
		}

		return checked === this.categories.length;
	}

	setAllCats(evt: any) {
		const chk = getCheckbox(evt);
		if (!chk) return;
		if (!this.data.categories) this.data.categories = {};
		const v = !chk.checked;
		for (const c of this.categories) {
			this.data.categories[c.cat] = v;
		}
		chk.checked = v;
		this.updateSidebar('category');
	}

	updateSidebar(why?: string) {
		setTimeout(() => {
			const cats = this.data.categories;
			if (forecastKeys.indexOf(why) > -1) this.updateForecast();

			this.sidebar.reqs = this.getReqs(this.data).join(', ');
			this.sidebar.categories = Object.keys(cats).filter((k) => cats[k]).join(', ');
			this.sidebar.networks = networks.filter((n) => !!this.data[n.toLowerCase()]).join(', ');
			this.sidebar.geos = (this.geoSel.val() || []).map((k) => CountriesAndStatesRev[k]).join(', ');
			if (this.kwsSel) this.sidebar.keywords = (this.kwsSel.val() || []).join(', ');
		}, 100); // has to be delayed otherwise we would have to hack how our checkboxes work..
	}

	ngAfterViewInit() {
		this.initGeo();

		this.initKeywords();
		this.onCampaignLoaded.subscribe((v) => {
			this.kwsSel.val(v.keywords).change();
		});

		$(() => {
			let iid, lastScrollTop;

			function a() {
				let scrollTop = $(window).scrollTop();
				if (lastScrollTop === scrollTop) return;

				lastScrollTop = scrollTop;

				const mainTop = $('div[three-column]').offset().top,
					winWidth = $(window).width(),
					ele = $('.right-sb');
				if (winWidth > 768 && scrollTop > mainTop) {
					scrollTop -= mainTop - 10;
				} else {
					scrollTop = 0;
				}

				ele.css({ marginTop: scrollTop });
			}

			iid = setInterval(() => {
				if (!$('create-audience').length) {
					clearInterval(iid);
					return;
				}
				a();
			}, 100);
			a();
		});
		this.updateSidebar('init');
	}

	private initGeo() {
		this.geoSel = $('select.geo').select2({
			data: CountriesAndStates,
			placeholder: 'Select a Country or a State',
			allowClear: true,
			width: '100%',
		});
		this.geoSel.on('select2:select', (_) => this.updateSidebar('geo'));
		this.geoSel.on('select2:unselect', (_) => this.updateSidebar('geo'));
	}

	private initKeywords() {
		this.kwsSel = $('select.kws').select2({
			tags: true,
			tokenSeparators: [','],
			placeholder: 'Type a keyword to see availability',
			allowClear: true,
			width: '100%',
		});
		this.kwsSel.on('select2:select', (e) => {
			this.updateSidebar('kws');
		});
		this.kwsSel.on('select2:unselect', (_) => this.updateSidebar('kws'));
	}

	resetPerks(type: number) {
		if (this.opts.isEdit && this.data.perks) return;
		this.data.perks = {
			name: '',
			count: 0,
			type: type,
		};
	}

	save = () => {
		if (this.loading) return;
		this.loading = true;
		let data = this.getCmp(this.data);
		data = {
			id: data.id,
			name: data.name,
			imageData: data.imageData,
			members: data.members,
			token: data.token,
		};

		// this should be done server side but for now we can do it here.
		if (!data.imageData) data.imageUrl = data.imageUrl;

		this.api.Post('audience', data, (resp) => {
			this.loading = false;
			this.AddNotification('success', 'Successfully Added Audience!');
			this.api.GoTo('mAudiences');
		}, (err) => {
			this.loading = false;
			this.AddNotification('error', err.msg);
			this.ScrollToTop();
		});
	}

	// fromCmp converts our campaign data to a ui-friendly format
	private setCmp(data: any): any {
		if (data.members) data.members = Object.keys(data.members).join(', ').trim();

		if (!Array.isArray(data.categories)) data.categories = [];

		if (!!data.categories.length) {
			$('#influencers').click();
		}

		data.categories = (() => { // convert categories to an object
			const out = {};
			data.categories.forEach((v) => out[v] = true);
			return out;
		})();

		if (data.imageUrl) {
			const img = new Image();
			img.src = data.imageUrl;
			this.cropper.setImage(img);
		}

		if (Array.isArray(data.geos)) {
			this.geoSel.val(data.geos.map((v) => v.state ? v.country + '-' + v.state : v.country)).change();
		}

		if (data.male || data.female || data.members || data.keywords || data.geos) {
			// you didn't see this, move on. - A Sith Lord.
			$('#targeting').click();
		}

		data.followerTarget = Target.FromObject(data.followerTarget);

		this.data = { ...this.data, ...data };

		this.onCampaignLoaded.emit(data);
	}

	private getCmp(data: any): any {
		data = { ...data };

		if (data.tags && data.tags.length) data.tags = data.tags.split(',').map((v) => v.trim());
		if (data.members === 'ALL') {
			data.members = null;
		} else if (data.members && data.members.length) {
			const wl = data.members.split(',').map((v) => v.trim());
			data.members = {};
			for (const it of wl) data.members[it] = true;
		}

		data.geos = (this.geoSel.val() || []).map((v) => {
			const parts = v.split('-'),
				ret: any = { country: parts[0] };
			if (parts.length === 2) ret.state = parts[1];
			return ret;
		});

		if (this.kwsSel) data.keywords = this.kwsSel.val();

		const cats = [];

		for (const k of Object.keys(data.categories)) {
			if (data.categories[k]) cats.push(k);
		}

		data.categories = cats;

		data.imageData = this.cropData.image;
		data.followerTarget = data.followerTarget.ToObject();

		return data;
	}

	private getReqs(d: any): string[] {
		const reqs = [];
		// Link, @mention, #hashtag, network, product photo
		if (!d.mention && !d.link && !d.tags) reqs.push('link, @mention or #hashtag');
		if (!networks.filter((n) => !!d[n.toLowerCase()]).length) reqs.push('network');
		// leaving this because it will be needed sooner or later
		// if (!d.imageData && !d.imageUrl && !this.cropData || !this.cropData.image) reqs.push('product photo');
		return reqs;
	}

	addToMembers(email: string) {
		if (!this.data.members || this.data.members === 'ALL') {
			this.data.members = email;
			$('#targeting').click(); // Oh look, boobies over there, don't look here.
		} else {
			this.data.members += ', ' + email;
		}
	}

	delFromMembers(email: string) {
		this.data.members = this.data.members.replace(email, '').replace(/^, |, $/, '');
	}

	isInMembers(email: string) {
		const wl = this.data.members;
		return !!wl && wl.indexOf(email) !== -1;
	}

	addAllMembers() {
		this.data.token = this.forecast.token;
		this.data.members = 'ALL';
	}

	updateForecast(paginate = false) {
		const data = this.getCmp(this.data);
		let token = '', start = 0;
		if (paginate && this.forecast.token) {
			token = this.forecast.token;
			start = this.forecastPagination.start;
		} else {
			this.forecastPagination.start = 0;
			this.influencers = [];
			this.data.token = null;
			this.data.members = '';
			this.forecast.token = null;
		}
		this.forecast.loading = true;
		this.getForecast(token, start, 2, data, (resp) => {
			resp.loading = false;
			resp.breakdown = Array.isArray(resp.breakdown) ? resp.breakdown : [];
			this.forecast = resp;
			this.influencers = this.influencers.concat(resp.breakdown || []);
			this.forecastPagination.start = this.influencers.length;
		});
	}

	// should be moved somewhere else but for now it'll be copied around...
	private getForecast = CallLimiter((token: string, start: number, results: number, data: any, done: (data?: any) => void) => {
		let ep = 'getForecast?start=' + start.toString() + '&results=' + results.toString();
		const oldToken = this.forecast.token || '';
		if (!!token) ep += '&token=' + token;
		if (oldToken && oldToken !== token) ep += '&deleteToken=' + oldToken;
		return this.api.Post(ep, data, (resp) => {
			done(resp || {});
		});
	}, 5000);

	// source: https://stackoverflow.com/a/44150539/145587
	@HostListener('window:scroll', ['$event'])
	onScroll($event: Event): void {
		if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
			if (!this.forecast.breakdown) return; // means our list is done so no need to make an extra api call
			this.updateForecast(true);
		}
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
const forecastKeys = ['init', 'geo', 'network', 'gender', 'members', 'category', 'kws', 'filter'];
