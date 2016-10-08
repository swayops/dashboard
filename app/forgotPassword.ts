import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Sway } from './sway';

@Component({
	selector: 'forgotPassword',
	templateUrl: './views/forgotPassword.html',
})

export class ForgotPasswordCmp {
	public form = { email: '', token: null };
	public loading = false;
	public success = false;
	public error: any;

	constructor(public route: ActivatedRoute, title: Title, public api: Sway) {
		title.setTitle('Sway :: Forgot Password');
	}

	ngOnInit() {
		this.form.token = this.route.params['token'];
	}

	ForgotPassword() {
		this.loading = true;
		this.api.ForgotPassword(this.form,
			data => { console.log(data); this.success = true; },
			err => { this.error = err; this.loading = false; }
		);
	}
}

