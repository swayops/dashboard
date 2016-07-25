import { Component, Injectable, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import {Observable} from 'rxjs/Rx';

import { User } from './user';

const apiURL = '/api/v1/';

@Injectable()
export class APIService {
	private _user: User;
	private _cuser: User;
	private _status = 0;
	redirectUrl: string;

	constructor(private router: Router, private http: Http) {}

	Login(info: { email: string, pass: string }, onError?: (err: any) => void) {
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
		return this.Post('signUp', info, data => this.router.navigate(['/dashboard']), onError);
	}

	ForgotPassword(data: any, onSuccess?: (data: any) => void, onError?: (err: any) => void) {
		return this.req('post', 'forgotPassword', data).subscribe(onSuccess, onError);
	}

	Get(ep: string, onResp: (data: any) => void, onErr: (err: any) => void) {
		return this.req('get', ep).subscribe(data => onResp(data), err => onErr(err));
	}

	Post(ep: string, payload: any, onResp: (data: any) => void, onErr: (err: any) => void) {
		return this.req('post', ep, payload).subscribe(data => onResp(data), err => onErr(err));
	}

	private req(method: string, ep: string, body?: any): Observable<any> {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		return this.http[method](apiURL + ep, body, options).map(res => res.json() || {}).catch(this.handleError);
	}

	private handleError(err: Response) {
		let errData = err.json();
		return Observable.throw(errData.msg || 'Server Error');
	}

	get IsLoggedIn() {
		console.log(this._status);
		if(this._status > 0) return Observable.of(this._status === 1)  //return this._status === 1;
		return Observable.create(obs => {
			let sub = this.Get('user', user => {
				this._user = user;
				this._status = 1;
				return obs.next(true);
			}, err => {
				console.log(err);
				this._status = 2;
				obs.next(false);
			});
			//return () => sub.unsubscribe();
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
	constructor(private router: Router, private api: APIService) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
		return this.api.IsLoggedIn.map(logged => {
			if(logged) return true;
			this.api.redirectUrl = state.url;
			this.router.navigate(['/login']);
			return false;
		});
	}

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
