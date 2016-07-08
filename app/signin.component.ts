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
		console.log(data)
		this.loading = true;
		this.http.post(loginUrl, data)
		.subscribe(
				this.check,
				this.check,
				() => console.log("x")
			);
	}

	private check(res: Response) {
		console.log(res);
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

