import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import {Observable} from 'rxjs/Rx';

import { User } from './user';

const apiURL = '/api/v1/';

@Injectable()
export class APIService {
	private users: User[] = [];
	constructor(private router: Router, private http: Http) {}

	Login(data: {email: string, pass: string}, onError?: (err: any) => void) {
		let obs = this.req('post', 'signIn', data);
		return obs.subscribe(data => this.router.navigate(['/dashboard', data.id]), onError);
	}

	SignUpAdvertiser(data: SignUpInfo, onError?: (err: any) => void) {
		let obs = this.req('post', 'signUp', data);
		return obs.subscribe(data => this.router.navigate(['/dashboard', data.id]), onError);
	}

	ForgotPassword(data: any, onSuccess?: (data: any) => void, onError?: (err: any) => void) {
		return this.req('post', 'forgotPassword', data).subscribe(onSuccess, onError);
	}

	Get(ep: string, onResp: (data: any, err?: any) => void) {
		return this.req('get', ep).subscribe(data => onResp(data), err => onResp(null, err));
	}

	private req(method: string, ep: string, body?: any): Observable<any> {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		return this.http[method](apiURL + ep, body, options).map(res => res.json() || {}).catch(this.handleError);
	}

	private handleError(err: Response) {
		let errData = err.json();
		//console.error(errData);
		return Observable.throw(errData.msg || 'Server Error');
	}

	IsLoggedIn(): boolean {
		return Array.isArray(this.users) && this.users.length > 0;
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
