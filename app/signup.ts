import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';

@Component({
	selector: 'signup',
	templateUrl: './views/signup.html',
})
export class SignUpCmp {
	public form: any = { name: '', email: '', pass: '', advertiser: {dspFee: 0.5, exchangeFee: 0.2} };
	public loading = false;
	public error: any;

	constructor(title: Title, public api: Sway) {
		title.setTitle('Sway :: Sign Up');
		this.api.Reset();
	}

	SignUp() {
		this.loading = true;
		this.api.SignUpAdvertiser(this.form, err => {
			this.error = err.msg;
			this.loading = false;
		});
	}
}
