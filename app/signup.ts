import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response } from '@angular/http';
import { Title } from '@angular/platform-browser';

const signUpUrl = '/api/v1/signIn';

@Component({
	selector: 'signup',
	template: require('./views/signup.html')
})

export class SignUpComponent implements OnInit {
	private form = {name:"", email: "", pass: "", agree: false};
	private loading = false;
	private error: any;

	constructor(private http: Http, private title: Title, private router: Router) {}

	ngOnInit() {
		this.title.setTitle("Sway :: Sign Up");
	}

	signUp(data: any) {
		if(!data.agree) {
			this.error = "You must agree to our terms and privacy policy.";
			return;
		}
		this.loading = true;
		var check = this.check.bind(this);
		return this.http.post(signUpUrl, data).subscribe(check, check);
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

