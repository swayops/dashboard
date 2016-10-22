import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';
import * as V from './validators';

@Component({
	selector: 'talents',
	templateUrl: './views/mTalents.html',
})
export class TalentsCmp extends ManageBase {
	public data = {
		name: '',
		parentId: null,
		influencer: {
			inviteCode: '',
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
			readOnlyOnEdit: true,
		},
		{
			title: 'Password:', placeholder: 'Your password', input: 'password', name: 'pass', req: true,
			pattern: /^.{8,}$/, error: 'Your password must be at least 8 characters long.',
			newOnly: true,
		},
		{
			title: 'Verify:', placeholder: 'Verify your password', input: 'password', name: 'pass2', req: true,
			sameAs: 'pass',
			newOnly: true,
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
			error: 'Please provide a valid phone number.',
		},
	];
	public editFields = this.EditFields(this.fields);

	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		super('getInfluencersByAgency', 'My Talents', title, api, route.snapshot.params['id']);
	}

	contactInfo(inf: any): string {
		return [
			['Email', inf.email],
			['Twitter', inf.twitterUsername],
			['Instagram', inf.instaUsername],
			['Facebook', inf.fbUsername],
			['YouTube', inf.youtubeUsername],
		].filter(v => !!v[1]).map(v => v.join(': ')).join('\n');
	}

	networkUrl(inf: any): string {
		const data = [
			['twitter', inf.twitterUsername],
			['instagram', inf.instaUsername],
			['facebook', inf.fbUsername],
			['youtube', inf.youtubeUsername],
		];
		let out = 'mailto:' + inf.email;
		data.some(v => {
			if (!!v[1] && networkUrls[v[0]]) {
				out = networkUrls[v[0]] + v[1];
				return true;
			}
		});
		return out;
	}
	save = (data, done) => {
		data.influencer.inviteCode = this.user.talentAgency.inviteCode;
		this.api.Post('signUp', data, resp => {
			let msg = resp.msg;
			if (resp.status === 'success') {
				msg = 'Talent ' + data.name + '(' + resp.id + ') was created successfully!';
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
		this.api.Put('influencer/' + data.id, data, resp => {
			this.AddNotification(resp.status, resp.status === 'success' ? 'Successfully updated.' : resp.msg, 5000);
			done();
			this.Reload();
		}, err => {
			this.AddNotification('error', err.msg);
			done();
		});
	}

	delete = (data) => {
		this.api.Get('setInviteCode/' + data.id + '/-', resp => {
			this.AddNotification(resp.status, resp.status === 'success' ? 'Successfully Deleted.' : resp.msg, 5000);
			this.Reload();
		}, err => {
			this.AddNotification('error', err.msg);
		});
	}
}


const networkUrls = {
	instagram: 'https://www.instagram.com/',
	youtube: 'https://www.youtube.com/user/',
	twitter: 'https://twitter.com/',
	facebook: 'https://www.facebook.com/',
};
