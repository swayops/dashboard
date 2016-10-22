import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';

@Component({
	selector: 'resetPassword',
	templateUrl: './views/resetPassword.html',
})

export class ResetPasswordCmp {
	public form: any = { token: '', email: '', pass: '', pass1: '' };
	public loading = false;
	public passwordsMatch = true;
	public error: any;

	constructor(title: Title, public api: Sway, route: ActivatedRoute) {
		title.setTitle('Sway :: Reset Password');
		this.form.token = route.snapshot.params['token'];
		this.api.Logout(false);
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

