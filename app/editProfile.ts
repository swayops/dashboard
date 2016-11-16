import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';
import { FormDlg } from './form';
import * as V from './validators';

@Component({
	selector: 'edit-profile',
	templateUrl: './views/editProfile.html',
})
export class EditProfileCmp extends ManageBase {
	public endpoint: string;
	@ViewChild('dlg') public dlg: FormDlg;

	public fields: any[] = [
		{
			title: 'Profile Pic:', placeholder: 'Your profile pic', image: true, name: 'imageUrl',
		},
		{
			title: 'Account Name:', placeholder: 'Your brand or name', input: 'text', name: 'name', req: true,
			pattern: /^..+$/, error: 'Please provide a name',
		},
		{
			title: 'Email:', placeholder: 'Your email, used for login', input: 'email', name: 'email', req: true,
			pattern: V.mailRe, error: 'Please provide a valid email address.', attrs: {
				readonly: true,
			},
		},
		{
			title: 'Phone:', pattern: V.phoneRe, placeholder: 'Your primary phone number', input: 'text', name: 'phone',
			error: 'Please provide a valid phone number.',
		},
		{
			title: 'Active:', placeholder: 'Uncheck to de-activate your account', toggle: true, name: 'status',
		},
	];

	private resetPassFields = [
		{
			title: 'Current Pass:', placeholder: 'Your current password', input: 'password', name: 'oldPass',
			pattern: /^.{8,}$/, error: 'Your password must be at least 8 characters long.',
		},
		{
			title: 'New Password:', placeholder: 'Your password', input: 'password', name: 'pass',
			pattern: /^.{8,}$/, error: 'Your password must be at least 8 characters long.',
		},
		{
			title: 'Verify:', placeholder: 'Verify your password', input: 'password', name: 'pass2',
			sameAs: 'pass',
		},
	];

	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		super(null, 'Edit Profile', title, api, route.snapshot.params['id'], () => this.init());
	}

	public init() {
		const u = this.user;
		if (u.adAgency) {
			this.endpoint = 'adAgency/' + u.id;
			this.fields[1].name = 'adAgency.name';
			this.fields[4].name = 'adAgency.status';
			if (this.api.IsAsUser()) {
				this.fields.push({
					title: 'I/O:', placeholder: 'Deactivate your account?', toggle: true, name: 'adAgency.io',
				});
			}
		}
		if (u.talentAgency) {
			this.endpoint = 'talentAgency/' + u.id;
			this.fields[1].name = 'talentAgency.name';
			this.fields[4].name = 'talentAgency.status';
		}
		if (u.advertiser) {
			if (this.api.IsAsUser()) {
				this.fields.push({ // only show to admins
					title: 'DSP Fee:', pattern: /^0\.[1-9][0-9]?$/, placeholder: 'DSP Fee', input: 'number',
					name: 'advertiser.dspFee', error: 'Please enter a number between 0.1 and 0.99',
				});
			}
			this.endpoint = 'advertiser/' + u.id;
			this.fields[1].name = 'advertiser.name';
			this.fields[4].name = 'advertiser.status';
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
				},
			);
			this.endpoint = 'influencer/' + u.id;
			this.fields[1].name = 'influencer.name';
			this.fields[4].name = 'influencer.status';
		}
		if (u.admin && !this.endpoint) {
			this.endpoint = 'admin/' + u.id;
		}
		this.dlg.fields = this.fields.concat(this.resetPassFields);
		this.dlg.show(u);
	}

	save = (data, done) => {
		this.api.Put(this.endpoint, data, resp => {
			this.AddNotification(resp.status, resp.status === 'success' ? 'Successfully updated your profile' : resp.msg, 5000);
			this.api.GoHome();
		}, err => {
			this.AddNotification('error', err.msg, 0);
			this.ScrollToTop();
			this.loading = false;
			done();
		});
	}
}
