import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';

@Component({
	selector: 'login',
	templateUrl: './views/login.html'
})

export class LoginCmp {
	private form = {email: "", pass: ""};
	private loading = false;
	private error: any;

	constructor(title: Title, private api: Sway) {
		title.setTitle("Sway :: Login");
		this.api.Reset();
	}

	Login() {
		this.loading = true;
		this.api.Login(this.form, err => {this.error = err; this.loading = false});
	}
}

