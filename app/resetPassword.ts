import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';

@Component({
	selector: 'resetPassword',
	templateUrl: './views/resetPassword.html',
})

export class ResetPasswordCmp {
	private form = { token: '', email: '', pass: '', pass1: '' };
	private loading = false;
	private passwordsMatch = true;
	private error: any;

	constructor(title: Title, private api: Sway, route: ActivatedRoute) {
		title.setTitle('Sway :: Reset Password');
		this.form.token = route.snapshot.params['token'];
		this.api.Reset();
	}

	check(val: any) {
		this.passwordsMatch = val.pass1 === '' || val.pass === val.pass1;
	}

	get valid(): boolean {
		return !this.loading && this.form.pass === this.form.pass1 && this.form.pass.length >= 8;
	}

	ResetPassword() {
		this.loading = true;
		this.api.Post('resetPassword', this.form, resp => this.api.GoTo('/'),
			err => this.error = 'There was a problem, please try again.');
	}
}

