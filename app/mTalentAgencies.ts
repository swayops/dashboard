import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';
import * as V from './validators';

@Component({
	selector: 'media-agencies',
	templateUrl: './views/mTalentAgencies.html',
})
export class TalentAgenciesCmp  extends ManageBase {
		public data = {
		name: '',
		parentId: null,
		talentAgency: {
			fee: 0.2,
		},
		status: true,
	};
	public fields = [
		{
			title: 'Account Name:', placeholder: 'Your brand or name', input: 'text', name: 'name', req: true,
			pattern: /^..+$/, error: 'Please provide a name',
		},
		{
			title: 'Email:', placeholder: 'Your email, used for login', input: 'email', name: 'email', req: true,
			pattern: V.mailRe, error: 'Please provide a valid email address.',
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
			title: 'Fee:', pattern: /^0\.[1-9][0-9]?$/, placeholder: 'Fee', input: 'number',
				name: 'talentAgency.fee', error: 'Please enter a number between 0.1 and 0.99',
		},
		{
			title: 'Phone:', pattern: V.phoneRe, placeholder: 'Your primary phone number', input: 'text', name: 'phone',
			error: 'Please provide a valid phone number.',
		},
		{
			title: 'Active:', placeholder: 'Deactivate your account?', toggle: true, name: 'talentAgency.status',
		},
	];
	public editFields = this.EditFields(this.fields);

	constructor(title: Title, api: Sway) {
		super('getAllTalentAgencies', 'Talent Agencies', title, api);
	}

	save = (data, done) => {
		this.api.Post('signUp', data, resp => {
			let msg = resp.msg;
			if (resp.status === 'success') {
				msg = 'Agency ' + data.name + '(' + resp.id + ') was created successfully!';
			}
			this.AddNotification(resp.status, msg);
			this.Reload();
			done();
		}, err => {
			this.AddNotification('error', err.msg);
			done();
		});
	}

	edit = (data, done) => {
		this.api.Put('talentAgency/' + data.id, data, resp => {
			this.AddNotification(resp.status, resp.status === 'success' ? 'Successfully updated.' : resp.msg, 5000);
			this.Reload();
			done();
		}, err => {
			this.AddNotification('error', err.msg);
			done();
		});
	}
}
