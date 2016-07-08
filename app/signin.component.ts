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
	private dataLoading = false;
	private error: any;
	constructor(private http: Http) {}

	signIn(data: {email: string, password: string}) {
		console.log(data)
		this.dataLoading = true;
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		// this.emailError = !this.email;
		// this.passwordError = !this.password;

		// if (this.emailError || this.passwordError) { return; }
		console.log("here")
		return this.http.post(loginUrl, data, { headers: headers }).subscribe(
				data => this.check(data),
				err => this.error = err.json().msg,
				() => console.log("x")
			);
	}

	private check(res: Response) {
		let body = res.json();
		console.log(body);
		return body.data || { };
	}

	get diagnostic() { return JSON.stringify(this, null, 4); }
}

