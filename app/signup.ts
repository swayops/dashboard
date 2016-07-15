import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response } from '@angular/http';
import { Title } from '@angular/platform-browser';

import { APIService, SignUpInfo } from './api';

const apiURL = '/api/v1/signUp';

@Component({
	selector: 'signup',
	template: require('./views/signup.html')
})

export class SignUpComponent {
	private form = { name: "", email: "", pass: "", advertiser: {dspFee: 0.5, exchangeFee: 0.2} };
	private loading = false;
	private error: any;

	constructor(private title: Title, private api: APIService) {
		title.setTitle("Sway :: Sign Up");
	}

	SignUp() {
		this.loading = true;
		this.api.SignUpAdvertiser(this.form, err => this.error = err);
	}
}

