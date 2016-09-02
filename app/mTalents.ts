import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';
import * as V from './validators';

@Component({
	selector: 'talents',
	templateUrl: './views/mTalents.html'
})
export class TalentsCmp extends ManageBase {
	private data = {
		name: '',
		parentId: null,
		influencer: {},
		status: true,
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
		{
			title: 'Phone:', pattern: V.phoneRe, placeholder: 'Your primary phone number', input: 'text', name: 'phone',
			error: 'Please provide a valid phone number.'
		},
	]

	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		super('getInfluencersByAgency', 'My Talents', title, api, route.snapshot.params['id']);
	}

	contactInfo(inf: any): string {
		return [
			['Email', inf.email],
			['Twitter', inf.twitterUsername],
			['Instagram', inf.instaUsername],
			['Facebook', inf.fbUsername]
		].filter(v => !!v[1]).map(v => v.join(': ')).join('\n');
	}

	save = (data, done) => {
		this.api.Post('signUp', this.data, data => {
			let msg = data.msg;
			if(data.status === 'success') {
				msg = 'Talent ' + this.data.name + '(' + data.id + ') was created successfully!';
			}
			this.AddNotification(data.status, msg);
			this.toggleDialog();
			this.Reload();
		}, err => this.AddNotification('error', err.msg));
	}
}
