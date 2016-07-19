import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { APIService } from './api';

@Component({
	selector: 'forgotPassword',
	template: require('./views/forgotPassword.html')
})

export class ForgotPasswordCmp {
	private form = { email: "" };
	private loading = false;
	private success = false;
	private uuid: any;
	private error: any;

	constructor(private route: ActivatedRoute, private title: Title, private api: APIService) {
		title.setTitle("Sway :: Forgot Password");
	}

	ngOnInit() {
		this.uuid = this.route.params['uuid'];
	}

	ForgotPassword() {
		this.loading = true;
		this.api.ForgotPassword(this.form,
			data => { console.log(data); this.success = true; },
			err => { this.error = err; this.loading = false }
		);
	}
}

