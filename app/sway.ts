import { Component, Injectable, Output } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { User } from './user';

const apiURL = '/api/v1/';

@Injectable()
export class Sway {
	private _user: User;
	private _cuser: User;
	private _status = 0;
	error: any;
	redirectUrl: string;

	constructor(private router: Router, private http: Http) {
		this.IsLoggedIn.subscribe(v => this._status = v ? 1 : 0);
	}

	Login(info: { email: string, pass: string }, onError?: (err: any) => void) {
		this.Reset()
		return this.Post('signIn', info, data => {
			return this.Get('user', user => {
				this._user = user;
				//debugger;
				this.router.navigate(this.redirectUrl ? [this.redirectUrl] : ['/dashboard']);
				this.redirectUrl = '';
				this._status = 1;
			}, onError);
		}, onError);
	}

	SignUpAdvertiser(info: SignUpInfo, onError?: (err: any) => void) {
		return this.Post('signUp?autologin=true', info, data => this.router.navigate(['/dashboard']), onError);
	}

	ForgotPassword(data: any, onSuccess?: (data: any) => void, onError?: (err: any) => void) {
		return this.req('post', 'forgotPassword', data).subscribe(onSuccess, onError);
	}

	Get(ep: string, onResp: (data: any) => void, onErr?: (err: any) => void) {
		return this.req('get', ep).subscribe(data => onResp(data), onErr);
	}

	Post(ep: string, payload: any, onResp: (data: any) => void, onErr?: (err: any) => void) {
		return this.req('post', ep, payload).subscribe(data => onResp(data), onErr);
	}

	SetCurrentUser(id?: string, onError?: (err: any) => void) {
		if(id == null) {
			this._cuser = null;
			return;
		}
		this.Get('user/' + id, user => this._cuser = user, onError)
	}

	Logout() {
		return this.Get('signOut', _ => {
			this.Reset()
			this.router.navigate(['/login']); // should say something maybe?
		});
	}

	Reset() {
		this._user = this._cuser = null;
		this._status = 0;
	}


	private req(method: string, ep: string, body?: any): Observable<any> {
		this.error = null;
		const headers = new Headers({ 'Content-Type': 'application/json' });
		const options = new RequestOptions({ headers: headers });
		return this.http[method.toLocaleLowerCase()](apiURL + ep, body, options).map(res => res.json()).catch(err => this.handleError(err));
	}

	private handleError(err: Response): Observable<{}>{
		const errData = err.json();
		this.error = errData;
		return Observable.throw(errData);
	}

	get IsLoggedIn() : Observable<boolean> {
		if(this._status > 0) return Observable.of(this._status === 1);
		return Observable.create(obs => {
			let sub = this.Get('user', user => {
				this._user = user;
				this._status = 1;
				return obs.next(true);
			}, err => {
				if(err.code === 401) this.error = null; // ignore 401 for this func
				this._status = 2;
				obs.next(false);
			});
			return () => sub.unsubscribe();
		}).take(1);
	}

	get User(): User { return this._user; }
	get CurrentUser(): User { return this._cuser || this._user; }

	IsAsUser(): boolean {
		return this.User.admin && !!this._cuser && this.User.id !== this._cuser.id
	}
}

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private router: Router, private api: Sway) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		return this.api.IsLoggedIn.map(logged => {
			if(logged) return true;
			this.api.redirectUrl = state.url;
			this.router.navigate(['/login']);
			return false;
		});
	}

}

export class HasAPI {
	constructor(protected api: Sway) {}
	get user() { return this.api.CurrentUser; }

	set error(err) { this.api.error = err; }
	@Output() get error() { return this.api.error; }
}

export interface SignUpInfo {
	name: string;
	email: string;
	pass: string;
	pass2?: string;
	advertiser: {
		dspFee: number;
		exchangeFee: number;
	}
}
