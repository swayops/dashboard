import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { APIService } from './api';

@Component({
	selector: 'login',
	template: require('./views/login.html')
})

export class LoginCmp {
	private form = {email: "", pass: ""};
	private loading = false;
	private error: any;

	constructor(private title: Title, private api: APIService) {
		title.setTitle("Sway :: Login");
	}

	Login() {
		this.loading = true;
		this.api.Login(this.form, err => {this.error = err; this.loading = false});
	}
}

