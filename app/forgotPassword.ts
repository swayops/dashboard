import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Sway } from './sway';

@Component({
	selector: 'forgotPassword',
	template: require('./views/forgotPassword.html')
})

export class ForgotPasswordCmp {
	private form = { email: "", token: null };
	private loading = false;
	private success = false;
	private error: any;

	constructor(private route: ActivatedRoute, private title: Title, private api: Sway) {
		title.setTitle("Sway :: Forgot Password");
	}

	ngOnInit() {
		this.form.token = this.route.params['token'];
	}

	ForgotPassword() {
		this.loading = true;
		this.api.ForgotPassword(this.form,
			data => { console.log(data); this.success = true; },
			err => { this.error = err; this.loading = false }
		);
	}
}

