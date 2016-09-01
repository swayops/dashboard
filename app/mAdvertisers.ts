import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';
import * as V from './validators';

@Component({
	selector: 'advertisers',
	templateUrl: './views/mAdvertisers.html'
})
export class AdvertisersCmp extends ManageBase {
	private data = {
		name: '',
		parentId: null,
		advertiser: {
			dspFee: 0,
		},
		dspFee: '0.2',
		status: true,
	};
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
		super('getAdvertisersByAgency', 'Advertisers', title, api, route.snapshot.params['id']);
		api.SetCurrentUser(this.id);
		this.data.parentId = this.id;
	}

	save = (data, done) => {
		this.data.advertiser.dspFee = parseFloat(this.data.dspFee);
		this.api.Post('signUp', this.data, data => {
			let msg = data.msg;
			if(data.status === 'success') {
				msg = 'Advertiser ' + this.data.name + '(' + data.id + ') was successfully created!';
			}
			this.AddNotification(data.status, msg);
			this.toggleDialog();
			this.Reload();
		}, err => this.AddNotification('error', err.msg));
	}
}
