import { Component, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway, HasAPI } from './sway';
import { Form } from './form';

import * as V from './validators';

@Component({
	selector: 'create-advertiser',
	templateUrl: './views/createAdvertiser.html',
})

export class CreateAdvertiserCmp extends HasAPI {
	private data = {
		name: '',
		parentId: null,
		advertiser: {
			dspFee: 0,
		},
		dspFee: '0.2',
	};
	private id: string;
	private fields = [
		{ title: 'Account Name:', placeholder: 'Your brand or name', input: 'text', name: 'name', req: true,
			pattern: /^..+$/, error: 'Please provide a name' },
		{ title: 'Email:', placeholder: 'Your email, used for login', input: 'email', name: 'email', req: true,
			pattern: V.mailRe, error: 'Please provide a valid email address.' },
		{ title: 'Password:', placeholder: 'Your password', input: 'password', name: 'pass', req: true,
			pattern: /^.{8,}$/, error: 'Your password must be at least 8 characters long.' },
		{ title: 'Verify Password:', placeholder: 'Verify your password', input: 'password', name: 'pass2', req: true,
		sameAs: 'pass' },
		{ title: 'DSP Fee:', pattern: /^0\.[1-9][0-9]?$/, placeholder: 'DSP Fee', input: 'number', name: 'dspFee',
			error: 'Please enter a number between 0.1 and 0.99' },

		{ title: 'Phone:', 	pattern: V.phoneRe, placeholder: 'Your primary phone number', input: 'text', name: 'phone',
			error: 'Please provide a valid phone number.' }
	];

	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		super(api);
		title.setTitle("Sway :: Create Advertiser");
		this.id = route.snapshot.params['id'];
		this.data.parentId = this.id;
	}

	save = () => {
		this.data.advertiser.dspFee = parseFloat(this.data.dspFee);
		this.api.Post('signUp', this.data, data => {
			let msg = data.msg;
			if(data.status === 'success') {
				msg = 'Advertiser ' + this.data.name + '(' + data.id + ') was successfully created!';
			}
			this.AddNotification(data.status, msg);
			this.api.GoTo('/mAdvertisers', this.id);
		});
	}

}

