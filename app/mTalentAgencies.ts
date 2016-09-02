import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';
import * as V from './validators';

@Component({
	selector: 'media-agencies',
	templateUrl: './views/mTalentAgencies.html'
})
export class TalentAgenciesCmp  extends ManageBase {
		private data = {
		name: '',
		parentId: null,
		talentAgency: {
			fee: 0.2
		},
		status: true
	};
	private fields = [
		{
			title: 'Account Name:', placeholder: 'Your brand or name', input: 'text', name: 'name', req: true,
			pattern: /^..+$/, error: 'Please provide a name'
		},
		{
			title: 'Email:', placeholder: 'Your email, used for login', input: 'email', name: 'email', req: true,
			pattern: V.mailRe, error: 'Please provide a valid email address.'
		},
		{
			title: 'Password:', placeholder: 'Your password', input: 'password', name: 'pass', req: true,
			pattern: /^.{8,}$/, error: 'Your password must be at least 8 characters long.'
		},
		{
			title: 'Verify Password:', placeholder: 'Verify your password', input: 'password', name: 'pass2', req: true,
			sameAs: 'pass'
		},
		{
			title: 'Fee:', pattern: /^0\.[1-9][0-9]?$/, placeholder: 'Fee', input: 'number',
				name: 'talentAgency.fee', error: 'Please enter a number between 0.1 and 0.99'
		},
		{
			title: 'Phone:', pattern: V.phoneRe, placeholder: 'Your primary phone number', input: 'text', name: 'phone',
			error: 'Please provide a valid phone number.'
		}
	];

	constructor(title: Title, api: Sway) {
		super('getAllTalentAgencies', 'Talent Agencies', title, api);
	}

	save = (data, done) => {
		this.api.Post('signUp', this.data, data => {
			let msg = data.msg;
			if(data.status === 'success') {
				msg = 'Agency ' + this.data.name + '(' + data.id + ') was created successfully!';
			}
			this.AddNotification(data.status, msg);
			this.toggleDialog();
			this.Reload();
		}, err => this.AddNotification('error', err.msg));
	}
}
