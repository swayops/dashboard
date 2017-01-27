import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ManageBase } from './manageBase';
import { Sway } from './sway';
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
			readOnlyOnEdit: true,
		},
		{
			title: 'Profile Pic:', placeholder: 'Your profile pic', image: true, name: 'imageUrl',
		},
		{
			title: 'Current Pass:', placeholder: 'Your current password', input: 'password', name: 'oldPass',
			pattern: /^.{8,}$/, error: 'Your password must be at least 8 characters long.',
			editOnly: true,
		},
		{
			title: 'New Password:', placeholder: 'Your password', input: 'password', name: 'pass', req: true,
			pattern: /^.{8,}$/, error: 'Your password must be at least 8 characters long.',
			reqNewOnly: true,
		},
		{
			title: 'Verify:', placeholder: 'Verify your new password', input: 'password', name: 'pass2', req: true,
			sameAs: 'pass',
			reqNewOnly: true,
		},
		{
			title: 'DSP Fee:', pattern: /^0\.[1-9][0-9]?$/, placeholder: 'DSP Fee', input: 'number',
			name: 'advertiser.dspFee', error: 'Please enter a number between 0.1 and 0.99',
			adminOnly: true,
		},
		{
			title: 'Phone:', pattern: V.phoneRe, placeholder: 'Your primary phone number', input: 'text', name: 'phone',
			error: 'Please provide a valid phone number.',
		},
		{
			title: 'Active:', placeholder: 'Deactivate your account?', toggle: true, name: 'advertiser.status',
		},
	];

	public createFields = this.CreateFields(this.fields);
	public editFields = this.EditFields(this.fields);

	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		super('getAdvertisersByAgency', 'Advertisers', title, api, route.snapshot.params['id']);
	}

	openAdv(adv: any) {
		if (adv.numCmps > 0) {
			this.api.GoTo('reporting', adv.id);
		} else {
			this.api.GoTo('createCampaign', adv.id);
		}
	}

	save = (data, done) => {
		data.parentId = this.id;
		data.name = data.advertiser.name;
		data.status = data.advertiser.status;

		this.api.Post('signUp', data, (resp) => {
			let msg = data.msg;
			if (resp.status === 'success') {
				msg = 'Advertiser ' + data.name + '(' + resp.id + ') was created successfully!';
			}
			this.AddNotification(resp.status, msg);
			this.Reload();
			done();
		}, (err) => {
			this.AddNotification('error', err.msg);
			done();
		});
	}

	edit = (data, done) => {
		this.api.Put('advertiser/' + data.id, data, (resp) => {
			this.AddNotification(resp.status, resp.status === 'success' ? 'Successfully updated.' : resp.msg, 5000);
			this.Reload();
			done();
		}, (err) => {
			this.AddNotification('error', err.msg);
			done();
		});
	}
}
