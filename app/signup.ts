import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response } from '@angular/http';
import { Title } from '@angular/platform-browser';

const apiURL = '/api/v1/signUp';

@Component({
	selector: 'signup',
	template: require('./views/signup.html')
})

export class SignUpComponent implements OnInit {
	private form = { name: "", email: "", pass: "", agree: false };
	private loading = false;
	private error: any;

	constructor(private http: Http, private title: Title, private router: Router) { }

	ngOnInit() {
		this.title.setTitle("Sway :: Sign Up");
	}

	signUp(data: any) {
		this.loading = true;
		data.pass2 = data.pass;
		data.advertiser = {
			dspFee: 0.5,
			exchangeFee: 0.2,
		};
		var check = this.check.bind(this);
		return this.http.post(apiURL, data).subscribe(check, check);
	}

	private check(res: Response) {
		this.loading = false;
		if (!res) return console.error('wtf?');
		let data = res.json();
		if (data.status === 'error') {
			this.error = data.msg;
			return
		}
		this.router.navigate(['/dashboard', data.id])
	}

	get diagnostic() { return JSON.stringify(this, null, 4); }
}

