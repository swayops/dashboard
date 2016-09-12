import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';
import * as V from './validators';

@Component({
	selector: 'edit-profile',
	templateUrl: './views/editProfile.html'
})
export class EditProfileCmp extends ManageBase {
	private _init = false;
	private fields: any[] = [
		{
			title: 'Account Name:', placeholder: 'Your brand or name', input: 'text', name: 'name', req: true,
			pattern: /^..+$/, error: 'Please provide a name'
		},
		{
			title: 'Email:', placeholder: 'Your email, used for login', input: 'email', name: 'email', req: true,
			pattern: V.mailRe, error: 'Please provide a valid email address.'
		},
		{
			title: 'Profile Pic:', placeholder: 'Your profile pic', input: 'file', name: 'pic',
			attrs: { accept: 'image/*' },
		},
		{
			title: 'Phone:', pattern: V.phoneRe, placeholder: 'Your primary phone number', input: 'text', name: 'phone',
			error: 'Please provide a valid phone number.'
		}
	];
	private resetPassFields = [
		{
			title: 'Password:', placeholder: 'Your password', input: 'password', name: 'pass', req: true,
			pattern: /^.{8,}$/, error: 'Your password must be at least 8 characters long.'
		},
		{
			title: 'Verify:', placeholder: 'Verify your password', input: 'password', name: 'pass2', req: true,
			sameAs: 'pass'
		}
	]

	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		super(null, 'Edit Profile', title, api, route.snapshot.params['id'], (data, err?) => this.initFields());
	}

	initFields() {
		//if (this._init) return this._fields;
		const u = this.user;
		if (u.advertiser) {
			this.fields.push({
				title: 'DSP Fee:', pattern: /^0\.[1-9][0-9]?$/, placeholder: 'DSP Fee', input: 'number',
				name: 'advertiser.dspFee', error: 'Please enter a number between 0.1 and 0.99'
			});
		}
		if (u.inf) {
			this.fields.push(
				{
					title: 'Instagram ID:', placeholder: 'Instagram ID', input: 'text', name: 'influencer.instagram',
				},
				{
					title: 'Facebook ID:', placeholder: 'Facebook ID', input: 'text', name: 'influencer.facebook',
				},
				{
					title: 'Twitter ID:', placeholder: 'Twitter ID', input: 'text', name: 'influencer.twitter',
				},
				{
					title: 'YouTube ID:', placeholder: 'YouTube ID', input: 'text', name: 'influencer.youtube',
				}
			)
		}
	}

	save = (data, done) => {
		console.log(this.user);
	}
}
