import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response } from '@angular/http';
import { Title } from '@angular/platform-browser';

import { Sway, SignUpInfo } from './sway';

@Component({
	selector: 'signup',
	templateUrl: './views/signup.html'
})
export class SignUpCmp {
	private form = { name: "", email: "", pass: "", advertiser: {dspFee: 0.5, exchangeFee: 0.2} };
	private loading = false;
	private error: any;

	constructor(title: Title, private api: Sway) {
		title.setTitle("Sway :: Sign Up");
	}

	SignUp() {
		this.loading = true;
		this.api.SignUpAdvertiser(this.form, err => this.error = err);
	}
}
