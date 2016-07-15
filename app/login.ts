import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response } from '@angular/http';
import { Title } from '@angular/platform-browser';

const apiURL = '/api/v1/signIn';

@Component({
	selector: 'login',
	template: require('./views/login.html')
})
export class LoginComponent implements OnInit {
	private form = {email: "", pass: ""};
	private loading = false;
	private error: any;

	constructor(private http: Http, private title: Title, private router: Router) {}

	ngOnInit() {
		this.title.setTitle("Sway :: Sign In");
	}

	signIn(data: any) {
		this.loading = true;
		var check = this.check.bind(this);
		return this.http.post(apiURL, data).subscribe(check, check);
	}

	private check(res: Response) {
		this.loading = false;
		if(!res) return console.error('wtf?');
		let data = res.json();
		if(data.status === 'error') {
			this.error = data.msg;
			return
		}
		this.router.navigate(['/dashboard'])
	}

	get diagnostic() { return JSON.stringify(this, null, 4); }
}

