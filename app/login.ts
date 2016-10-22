import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';

@Component({
	selector: 'login',
	templateUrl: './views/login.html',
})

export class LoginCmp {
	public form: any = {email: '', pass: ''};
	public loading = false;
	public error: any;

	constructor(title: Title, public api: Sway) {
		title.setTitle('Sway :: Login');
		this.api.Logout(false);
	}

	Login() {
		this.loading = true;
		this.api.Login(this.form, err => { this.error = err.msg; this.loading = false; });
	}
}
