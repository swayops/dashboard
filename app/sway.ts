import { EventEmitter, Injectable, Output } from '@angular/core';
import { Headers, Http, RequestOptions, Response, ResponseContentType } from '@angular/http';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

export const apiURL = '/api/v1/';

declare const $: any;

@Injectable()
export class Sway {
	public mainUser: User;
	public curUser: User;
	public loginStatus = 0;
	public OnLogin: EventEmitter<any> = new EventEmitter();
	error: any;
	redirectUrl: string;

	private updatedIntercom: boolean;

	constructor(public router: Router, public http: Http) {
		this.IsLoggedIn.subscribe((v) => this.loginStatus = v ? 1 : 0);
	}

	Login(info: { email: string, pass: string }, onError?: (err: any) => void) {
		this.Reset();
		return this.Post('signIn', info, (data) => {
			return this.Get('user', (user) => {
				this.mainUser = user;
				this.OnLogin.emit(user);
				if (this.redirectUrl) {
					this.GoTo(this.redirectUrl);
				} else {
					this.GoHome();
				}
				this.redirectUrl = '';
				this.loginStatus = 1;
			}, onError);
		}, onError);
	}

	SignUpAdvertiser(info: SignUpInfo, onError?: (err: any) => void, forceReload: boolean = false) {
		return this.Post('signUp?autologin=true', info, (data) => {
			return this.Get('user', (user) => {
				this.mainUser = user;
				this.redirectUrl = '';
				this.OnLogin.emit(user);
				if (forceReload) {
					location.replace('/reporting');
				} else {
					this.GoHome();
					this.loginStatus = 1;
				}
			}, onError);
		}, onError);
	}

	ForgotPassword(data: any, onSuccess?: (data: any) => void, onError?: (err: any) => void) {
		return this.req('post', 'forgotPassword', data).subscribe(onSuccess, onError);
	}

	Get(ep: string, onResp: (data: any) => void, onErr?: (err: any) => void) {
		return this.req('get', ep).subscribe((data) => onResp(data), onErr);
	}

	Post(ep: string, payload: any, onResp: (data: any) => void, onErr?: (err: any) => void) {
		return this.req('post', ep, payload).subscribe((data) => onResp(data), onErr);
	}

	Put(ep: string, payload: any, onResp: (data: any) => void, onErr?: (err: any) => void) {
		return this.req('put', ep, payload).subscribe((data) => onResp(data), onErr);
	}

	Delete(ep: string, onResp: (data: any) => void, onErr?: (err: any) => void) {
		return this.req('delete', ep).subscribe((data) => onResp(data), onErr);
	}

	SetCurrentUser(id: string = null, force: boolean = false): Promise<User> {
		if (id == null) {
			this.curUser = null;
			return Promise.resolve(this.mainUser);
		}
		if (id === this.CurrentUser.id && !force) {
			return Promise.resolve(this.CurrentUser);
		}
		return new Promise((resolve, reject) => {
			this.Get('user/' + id, (user) => { this.curUser = user; resolve(user); }, (err) => reject(err));
		});
	}

	Logout(redir = true) {
		return this.Get('signOut', (_) => {
			this.Reset();
			if (redir) this.router.navigate(['/login']); // should say something maybe?
		}, () => { /* ignore errors */ });
	}

	GoHome(goToParent = false) {
		const user = goToParent ? this.User : this.CurrentUser;
		if (user.admin) {
			this.GoTo('/dashboard');
		} else if (user.advertiser) {
			if (!!user.advertiser.planID) {
				this.GoTo('/mBilling', user.id);
			} else {
				this.GoTo(user.hasCmps ? '/mCampaigns' : '/createCampaign', user.id);
			}
		} else if (user.adAgency) {
			this.GoTo('/mAdvertisers', user.id);
		} else if (user.talentAgency) {
			this.GoTo('/mTalents', user.id);
		}
	}

	GoTo(...args: string[]) {
		this.router.navigate(args.filter((arg) => !!arg));
	}

	Reset() {
		this.mainUser = this.curUser = null;
		this.loginStatus = 0;
	}

	public req(method: string, ep: string, body?: any): Observable<any> {
		this.error = null;
		const headers = new Headers({ 'Content-Type': 'application/json' });
		const options = new RequestOptions({ headers: headers });
		return this.http[method.toLocaleLowerCase()](apiURL + ep, body, options).map((res) => res.json())
			.catch((err) => this.handleError(err));
	}

	public PostBinary(ep: string, body?: any): Observable<any> {
		const headers = new Headers({ 'Content-Type': 'application/json' });
		const options = new RequestOptions({
			headers: headers,
			responseType: ResponseContentType.Blob,
		});
		return this.http.post(apiURL + ep, body, options);
	}

	public handleError(err: Response): Observable<{}> {
		let errData = err.json();
		if ('target' in errData) {
			errData = { status: 'error', msg: 'Connection Error' };
		}
		this.error = errData;
		if (this.error.code === 401) this.loginStatus = 2;
		return Observable.throw(errData);
	}

	get IsLoggedIn(): Observable<boolean> {
		if (this.loginStatus > 0) return Observable.of(this.loginStatus === 1);
		return Observable.create((obs) => {
			const sub = this.Get('user', (user) => {
				if (!this.mainUser) {
					this.OnLogin.emit(user);
					if (user.advertiser) this.updateIntercom(user);
				}
				this.mainUser = user;
				this.loginStatus = 1;
				return obs.next(true);
			}, (err) => {
				if (err.code === 401) this.error = null; // ignore 401 for this func
				this.loginStatus = 2;
				obs.next(false);
			});
			return () => sub.unsubscribe();
		}).take(1);
	}

	get User(): User { return this.mainUser; }
	get CurrentUser(): User { return this.curUser || this.mainUser; }

	IsAdmin(): boolean {
		return !!this.User.admin;
	}

	IsAgency(): boolean {
		const u = this.User;
		return !!this.curUser && u.id !== this.curUser.id && !u.admin && (!!u.adAgency || !!u.talentAgency);
	}

	private updateIntercom(user: User) {
		if (this.updatedIntercom) return;
		this.Get('getCampaignsByAdvertiser/' + user.id, (data) => {
			(window as any).Intercom('boot', {
				app_id: 'gtphmh27',
				HAS_CREATED_ATLEAST_1_CAMPAIGN: Array.isArray(data) && data.length > 0,
				PLAN_TYPE: plan_types[user.advertiser.planID || 0],
			});
		});
	}
}

const plan_types = ['None', 'Hyper Local', 'Premium', 'Enterprise'];

// *WARNING*, if you get auth errors, make sure your page is in here
const authPages = {
	adAgency: ['mAdvertisers', 'mAudiences', 'createAudience', 'editAudience', 'editProfile'],
	talentAgency: ['mTalents', 'editProfile'],
	advertiser: [
		'createCampaign', 'editCampaign', 'mCampaigns', 'reporting', 'mBilling',
		'contentFeed', 'editProfile', 'shippingPerks', 'mSubUsers',
		'mAudiences', 'createAudience', 'editAudience',
	],
};
@Injectable()
export class AuthGuard implements CanActivate {
	constructor(public router: Router, public api: Sway) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		return this.api.IsLoggedIn.map((logged) => {
			if (logged && (!this.api.error || this.api.error.code !== 401)) {
				const user = this.api.CurrentUser;
				if (user.admin) return true;

				const userPages = authPages[UserType(user)] || [],
					pageName = this.pageName(state.url);

				if (userPages.indexOf(pageName) > -1) return true;
				if (user.adAgency && authPages.advertiser.indexOf(pageName) > -1) return true;
			}
			this.api.redirectUrl = state.url;
			this.router.navigate(['/login']);
			return false;
		});
	}

	pageName(p: string): string {
		p = p.substr(1);
		const idx = p.indexOf('/');
		if (idx !== -1) return p.substr(0, idx);
		return p;
	}
}

let allNotifications: Notification[] = [];
export class HasAPI {
	constructor(protected api: Sway) { }
	get user() { return this.api.CurrentUser; }

	set error(err) { this.api.error = err; }
	@Output() get error() { return this.api.error; }

	get notifications(): Notification[] {
		allNotifications.forEach((v) => {
			if (v.timeout > 0) setTimeout(() => v.timeout = -1, v.timeout);
		});
		allNotifications = allNotifications.filter((v) => v.timeout !== -1);
		return allNotifications;
	}

	// if no timeout is specified, it defaults to 6s
	AddNotification(type: string, msg: any, timeout?: number) {
		if (!timeout) timeout = 6000;
		if (typeof msg === 'object' && 'msg' in msg) msg = msg.msg;
		if (!msg) return;
		if (msg[0] === '{') {
			const rerr = JSON.parse(msg) || { message: 'Unknown error' };
			if ('message' in rerr) {
				msg = rerr.message;
			}
		}
		allNotifications.push({ type, msg, timeout });
	}

	ResetNotifications() {
		allNotifications = [];
	}

	ScrollToTop(speed: number = 800) {
		$('body,html').animate({
			scrollTop: 0,
		}, speed);
	}

	get settings(): any {
		return (window as any).appSettings;
	}
}

export function UserType(user): string {
	if (!user) return '';
	if (user.admin) return 'admin';
	if (user.advertiser) return 'advertiser';
	if (user.talentAgency) return 'talentAgency';
	if (user.adAgency) return 'adAgency';
	return '';
}

export interface SignUpInfo {
	name: string;
	email: string;
	pass: string;
	pass2?: string;
	advertiser: {
		dspFee: number;
	};
}

export function LoadScript(src: string, args?: { [key: string]: any }): Promise<Event> {
	return new Promise<Event>((resolve) => {
		const n = document.createElement('script');
		n.onload = (e) => resolve(e);
		n.type = 'text/javascript';
		n.async = true;
		n.defer = true;
		n.charset = 'utf-8';
		if (args) {
			for (const k of Object.keys(args)) {
				n.setAttribute(k, args[k]);
			}
		}
		n.src = src;
		document.getElementsByTagName('head')[0].appendChild(n);
	});
}

interface Notification {
	type: string;
	msg: string;
	timeout: number;
}

interface User {
	id: string;
	parentId: string;
	name: string;
	email: string;
	phone: string;
	address: string;
	status: boolean;
	createdAt: number;
	updatedAt: number;

	admin?: boolean;

	adAgency?: any;
	talentAgency?: any;
	advertiser?: any;
	hasCmps?: boolean;
	inf?: any;
	isIO?: boolean;

	subUser?: string;
}
