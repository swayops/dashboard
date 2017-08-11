import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { ManageBase } from './manageBase';
import { Modal } from './modal';
import { Sway } from './sway';

import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';

import { AlphaCmp, CallLimiter, CountriesAndStates, CountriesAndStatesRev, Iter, PersistentEventEmitter, Target } from './utils';

import { GetAudienceEndpoint } from './mAudiences';

/// **WARNING** any changes here should be reflected in createAudience as well.

declare const $: any;

@Component({
	selector: 'create-campaign',
	templateUrl: './views/createCampaign.html',
	entryComponents: [ImageCropperComponent],
})
export class CreateCampaignCmp extends ManageBase {
	public data: any = {
		advertiserId: null,
		categories: {},
		audiences: {},
		male: true,
		female: true,
		status: true,
		facebook: false,
		twitter: false,
		instagram: true,
		youtube: false,
		perks: {
			name: '',
			count: 0,
		},
		keywords: [],
		whitelistSchedule: {},
		cmpBlacklist: {},
		followerTarget: new Target(),
		engTarget: new Target(),
		priceTarget: new Target(true),
		monthly: true,
	};

	public whitelistKeys = new Set<string>();
	public scheduling = false;

	public infDlgButtons = [
		{ name: 'Cancel', class: 'btn-blue ghost' },
	];

	@Output() sidebar: any = {
		errors: [],
	};

	@Output() public forecast: any = { loading: true };
	@Output() public influencers: any[] = [];

	private forecastPagination = {
		start: 0,
	};

	public categories = [];
	public audiences = [];
	public audiencesObj = {};
	public categoryImages = categoryImages;
	public opts: any = {
		isEdit: false,
	};

	public plan = 3;

	@ViewChild('cropper') public cropper: ImageCropperComponent;
	public cropperSettings: any;
	public cropData: any = {};

	private geoSel;
	private kwsSel;
	public waitingForExport = false;

	private onCampaignLoaded: PersistentEventEmitter<any> = new PersistentEventEmitter();

	constructor(title: Title, api: Sway, route: ActivatedRoute, private cdRef: ChangeDetectorRef) {
		super(null, route.snapshot.url[0].path === 'editCampaign' ? '-Edit Campaign' : '-Create Campaign',
			title, api, route.snapshot.params['id'], (user) => {
				const adv = this.user.advertiser;
				this.plan = (!adv || this.user.isIO) ? 3 : adv.planID || 0;
			});

		this.api.Get('getCategories', (resp) => {
			this.categories = (resp || []).sort((a, b) => AlphaCmp(a.cat, b.cat)); // sort by name
		});

		this.api.Get('billingInfo/' + this.id, (resp) => {
			if (!resp.cc) return;
			this.sidebar.lastFour = resp.cc.cardNumber;
		});

		this.data.advertiserId = this.id;
		this.opts.isEdit = route.snapshot.url[0].path === 'editCampaign';
		if (this.opts.isEdit) {
			const cid = route.snapshot.params['cid'];
			this.api.Get('campaign/' + cid, (resp) => {
				this.setCmp(resp);
				this.updateSidebar('init');
			});
		}

		this.cropperSettings = {
			...new CropperSettings(),
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
		};
		this.api.SetCurrentUser(this.id).then((user) => {
			this.api.Get('getUserAudiences/' + this.id, (resp) => {
				resp = (this.id in resp) ? resp[this.id] : resp;
				const aud = Object.keys(resp).map((k) => resp[k]);

				this.audiences = aud.sort((a, b) => AlphaCmp(a.name, b.name)); // sort by name
				this.audiencesObj = resp;
			});
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
			const sb = this.sidebar,
				auds = this.data.audiences,
				cats = this.data.categories;
			if (forecastKeys.indexOf(why) > -1) this.updateForecast();
			sb.reqs = this.getReqs(this.data).join(', ');
			sb.categories = Object.keys(cats).filter((k) => cats[k]).join(', ');
			sb.audiences = Object.keys(auds).filter((k) => auds[k]).map((k) => (this.audiencesObj[k] || {}).name || '').join(', ');
			sb.networks = networks.filter((n) => !!this.data[n.toLowerCase()]).join(', ');
			sb.geos = (this.geoSel.val() || []).map((k) => CountriesAndStatesRev[k]).join(', ');
			if (this.kwsSel) sb.keywords = (this.kwsSel.val() || []).join(', ');
		}, 100); // has to be delayed otherwise we would have to hack how our checkboxes work..
	}

	ngAfterViewInit() {
		this.initGeo();

		this.initKeywords();
		this.onCampaignLoaded.subscribe((v) => {
			const val = (v.keywords || []).map((k) => {
				return { id: k, text: k };
			});
			this.kwsSel.select2({ tags: val }); // go die in a fire
			this.kwsSel.val(v.keywords).trigger('change');
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
				if (!$('create-campaign').length) {
					clearInterval(iid);
					return;
				}
				a();
			}, 100);
			a();
		});

		// if we're editing, wait for the campaign data to fully load first.
		if (!this.opts.isEdit) this.updateSidebar('init');
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
			multiple: true,
			tags: true,
			tokenSeparators: [','],
			placeholder: 'Type a keyword to see availability',
			allowClear: true,
			width: '100%',
		});

		this.kwsSel.on('select2:select', () => this.updateSidebar('kws'));

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
		const data = this.getCmp(this.data);
		if (this.opts.isEdit) {
			this.api.Put('campaign/' + data.id, data, (resp) => {
				this.loading = false;
				this.AddNotification('success', 'Successfully Edited Campaign!');
				if (data.perks && data.perks.type !== 2) { // only if it's not a coupon perk.
					this.api.GoTo('shippingPerks', this.id);
				} else {
					this.api.GoTo('mCampaigns', this.id);
				}
			}, (err) => {
				this.loading = false;
				this.AddNotification('error', err.msg);
				this.ScrollToTop();
			});
		} else {
			this.api.Post('campaign', data, (resp) => {
				this.loading = false;
				this.AddNotification('success', 'Successfully Edited Campaign!');
				if (data.perks && data.perks.type === 1) {
					this.api.GoTo('shippingPerks', this.id);
				} else {
					this.api.GoTo('mCampaigns', this.id);
				}
			}, (err) => {
				this.loading = false;
				this.AddNotification('error', err.msg);
				this.ScrollToTop();
			});
		}
	}

	// fromCmp converts our campaign data to a ui-friendly format
	private setCmp(data: any): any {
		if (Array.isArray(data.tags) && data.tags.length) data.tags = data.tags.join(', ').trim();

		if (!Array.isArray(data.categories)) data.categories = [];
		if (!Array.isArray(data.audiences)) data.audiences = [];

		if (!!data.categories.length || !!data.audiences.length) {
			$('#influencers').click();
		}

		data.categories = (() => { // convert categories to an object
			const out = {};
			data.categories.forEach((v) => out[v] = true);
			return out;
		})();

		data.audiences = (() => {
			const out = {};
			data.audiences.forEach((v) => out[v] = true);
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
			this.geoSel.val(data.geos.map((v) => v.state ? v.country + '-' + v.state : v.country)).change();
		}

		if (data.male || data.female || data.keywords || data.geos) {
			// you didn't see this, move on. - A Sith Lord.
			$('#targeting').click();
		}

		this.whitelistKeys = new Set<string>(Object.keys(data.whitelistSchedule || {}));

		Iter(data.whitelistSchedule, (_, v) => {
			if (v.to && v.from) {
				v.scheduling = true;
			}
		});

		data.followerTarget = Target.FromObject(data.followerTarget);
		data.engTarget = Target.FromObject(data.engTarget);
		data.priceTarget = Target.FromObject(data.priceTarget, true);

		// if (data.monthly == null) data.monthly = true;

		this.data = data;

		if (data.perks) {
			if (this.opts.isEdit) {
				$('#perks').prop('checked', true);
				$('.toggle-perks').show();
			} else {
				$('#perks').click();
			}
		}

		if (!data.perks) this.resetPerks(0);
		if (Array.isArray(data.perks.codes)) {
			data.perks.codes = data.perks.codes.join(' ');
		}

		if (!data.cmpBlacklist) data.cmpBlacklist = {};

		if (this.whitelistKeys.size || Object.keys(data.cmpBlacklist).length) {
			$('#whiteblacklists').click();
		}

		this.onCampaignLoaded.emit(data);
	}

	private getCmp(data: any): any {
		data = { ...data };
		data.perks = { ...data.perks };
		data.whitelistSchedule = { ...data.whitelistSchedule };

		data.followerTarget = data.followerTarget.ToObject();
		data.engTarget = data.engTarget.ToObject();
		data.priceTarget = data.priceTarget.ToObject();

		if (data.tags && data.tags.length) data.tags = data.tags.split(',').map((v) => v.trim());

		Iter(data.whitelistSchedule, (k, v) => {
			const nv = {
				from: v.from,
				to: v.to,
			};
			if (nv.from instanceof Date) {
				nv.from = nv.from.getTime() / 1000;
			}
			if (nv.to instanceof Date) {
				nv.to = nv.to.getTime() / 1000;
			}

			if (nv.from === nv.to) nv.to = nv.from + 86400000;

			data.whitelistSchedule[k] = nv;
		});

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

		const auds = [];
		for (const k of Object.keys(data.audiences)) {
			if (data.audiences[k]) auds.push(k);
		}
		data.audiences = auds;

		if (data.perks.codes) {
			data.perks.codes = data.perks.codes.split(/[\s,]+/g).filter((v) => !!v.length);
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
		if (!networks.filter((n) => !!d[n.toLowerCase()]).length) reqs.push('network');
		// leaving this because it will be needed sooner or later
		// if (!d.imageData && !d.imageUrl && !this.cropData || !this.cropData.image) reqs.push('product photo');
		return reqs;
	}

	addToWhitelist(emails: string) {
		if (!$('#whitelist').is(':checked')) {
			$('#whitelist').click(); // Oh look, boobies over there, don't look here.
		}
		if (!this.data.whitelistSchedule) this.data.whitelistSchedule = {};
		for (const email of emails.split(',').map((v) => v.trim())) {
			this.data.whitelistSchedule[email] = { from: 0, to: 0 };
			this.whitelistKeys.add(email);
		}
	}

	addToWhitelistInput(e) {
		e.preventDefault();
		const ele = e.target,
			val = ele.value.trim();
		if (!val) return;
		this.addToWhitelist(val);
		ele.value = '';
	}

	delFromWhitelist(email: string) {
		delete this.data.whitelistSchedule[email];
		this.whitelistKeys.delete(email);
	}

	addToBlacklist(emails: string) {
		if (!$('#blacklist').is(':checked')) {
			$('#blacklist').click(); // Oh look, boobies over there, don't look here.
		}
		for (const email of emails.split(',').map((v) => v.trim())) {
			this.data.cmpBlacklist[email] = true;
		}
	}

	addToBlacklistInput(e) {
		e.preventDefault();
		const ele = e.target,
			val = ele.value.trim();
		if (!val) return;
		this.addToBlacklist(val);
		ele.value = '';
	}

	delFromBlacklist(email: string) {
		delete this.data.cmpBlacklist[email];
	}

	isInWhitelist(email: string) {
		if (!this.data.whitelistSchedule) this.data.whitelistSchedule = {};
		return email in this.data.whitelistSchedule;
	}

	updateForecast(paginate = false) {
		const data = this.getCmp(this.data);
		let token = '', start = 0;
		if (paginate && this.forecast.token) {
			token = this.forecast.token;
			start = this.forecastPagination.start;
			if (start > 5) return; // we only need top 250
		} else {
			this.forecastPagination.start = 0;
			this.influencers = [];
			this.data.token = null;
			this.forecast.token = null;
		}
		this.forecast.loading = true;
		this.getForecast(token, start, start > 0 ? 250 : 5, data, (resp) => {
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

	showInfList(m: Modal) {
		m.showAsync((done: (data?: any) => void) => {
			const data = this.getCmp(this.data);
			this.getForecast(this.forecast.token, 5, 250, data, (resp) => done(resp.breakdown || []));
		});
	}

	exportForecast() {
		if (this.waitingForExport) return;
		this.waitingForExport = true;
		this.api.PostBinary('getForecastExport/forecast.pdf', this.getCmp(this.data)).subscribe((resp) => {
			this.waitingForExport = false;
			const link = document.createElement('a');
			const objURL = window.URL.createObjectURL(resp._body);
			link.href = objURL;
			link.download = 'forecast.pdf';
			link.click();
			setTimeout(function() { URL.revokeObjectURL(objURL); }, 100);
		});
	}

	get canPreApprove(): boolean {
		return this.plan === 3 || this.user.isIO;
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
const forecastKeys = ['init', 'geo', 'network', 'gender', 'whitelistSchedule', 'category', 'kws', 'filter'];
