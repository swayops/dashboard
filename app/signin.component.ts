import { Component, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { User } from './user';

const loginUrl = '/api/v1/signIn';

@Component({
	selector: 'signIn',
	templateUrl : 'app/views/signIn.html',
})


export class SignInComponent {
	private form = {email: "", pass: ""};
	private loading = false;
	private error: any;
	constructor(private http: Http) {}

	signIn(data: any) {
		this.loading = true;
		var check = this.check.bind(this);
		return this.http.post(loginUrl, data).subscribe(check, check);
	}

	private check(res: Response) {
		this.loading = false;
		if(!res) return console.error('wtf?');
		let data = res.json();
		if(data.status === 'error') {
			this.error = data.msg;
			return
		}
		//return { };
	}

	get diagnostic() { return JSON.stringify(this, null, 4); }
}

