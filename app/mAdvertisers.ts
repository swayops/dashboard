import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';
import * as V from './validators';

@Component({
	selector: 'advertisers',
	templateUrl: './views/mAdvertisers.html',
})
export class AdvertisersCmp extends ManageBase {
	public fields = [
		{
			title: 'Account Name:', placeholder: 'Your brand or name', input: 'text', name: 'advertiser.name', req: true,
			pattern: /^..+$/, error: 'Please provide a name',
		},
		{
			title: 'Email:', placeholder: 'Your email, used for login', input: 'email', name: 'email', req: true,
			pattern: V.mailRe, error: 'Please provide a valid email address.',
		},
		{
			title: 'Profile Pic:', placeholder: 'Your profile pic', input: 'file', name: 'pic',
				attrs: {accept: 'image/*'},
		},
		{
			title: 'Password:', placeholder: 'Your password', input: 'password', name: 'pass', req: true,
			pattern: /^.{8,}$/, error: 'Your password must be at least 8 characters long.',
			reqNewOnly: true,
		},
		{
			title: 'Verify:', placeholder: 'Verify your password', input: 'password', name: 'pass2', req: true,
			sameAs: 'pass',
			reqNewOnly: true,
		},
		{
			title: 'DSP Fee:', pattern: /^0\.[1-9][0-9]?$/, placeholder: 'DSP Fee', input: 'number',
			name: 'advertiser.dspFee', error: 'Please enter a number between 0.1 and 0.99',
		},
		{
			title: 'Phone:', pattern: V.phoneRe, placeholder: 'Your primary phone number', input: 'text', name: 'phone',
			error: 'Please provide a valid phone number.',
		},
		{
			title: 'Active:', placeholder: 'Deactivate your account?', checkbox: true, name: 'status',
		},
	];

	public editFields = this.EditFields(this.fields);

	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		super('getAdvertisersByAgency', 'Advertisers', title, api, route.snapshot.params['id']);
	}

	save = (data, done) => {
		data.parentId = this.id;
		data.status = true;
		this.api.Post('signUp', data, resp => {
			let msg = data.msg;
			if (resp.status === 'success') {
				msg = 'Advertiser ' + data.name + '(' + resp.id + ') was created successfully!';
			}
			this.AddNotification(resp.status, msg);
			this.Reload();
		}, err => this.AddNotification('error', err.msg));
	}

	edit = (data, done) => {
		this.api.Put('advertiser/' + data.id, data, resp => {
			this.AddNotification(resp.status, resp.status === 'success' ? 'Successfully updated.' : resp.msg, 5000);
			done();
			this.Reload();
		}, err => this.AddNotification('error', err));
	}
}
