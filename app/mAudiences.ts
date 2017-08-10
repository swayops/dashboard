import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { ManageBase } from './manageBase';
import { ModalEvent } from './modal';
import { apiURL, Sway } from './sway';

declare const $: any;

@Component({
	selector: 'audiences',
	templateUrl: './views/mAudiences.html',
})
export class AudiencesCmp extends ManageBase {
	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		super(null, 'Audiences', title, api, null);
		this.id = route.snapshot.params['id'];
		api.SetCurrentUser(this.id || '1').then((user) => {
			if (!this.id && user.admin) {
				this.apiEndpoint = 'audience';
			} else {
				this.apiEndpoint = 'getUserAudiences/' + this.id + '?canEdit=true';
			}
			this.Reload(() => this.init());
		});

	}
	private init() {
		if (Array.isArray(this.list) || this.list == null) return;
		const list = [];
		for (const k of Object.keys(this.list).sort()) {
			const o = this.list[k];
			o.sub = Object.keys(o.members).length;
			list.push(o);
		}
		this.list = list;
	}

	Delete(id: string) {
		this.loading = true;
		let ep = '';
		if (this.id) {
			if (this.api.CurrentUser.adAgency) {
				ep = 'agency/audience/' + this.id + '/' + id;
			} else if (this.api.CurrentUser.advertiser) {
				ep = 'advertiser/audience/' + this.id + '/' + id;
			} else {
				return console.error('invalid user', this.api.CurrentUser);
			}
		} else {
			ep = 'audience/' + id;
		}
		this.api.Delete(ep, (resp) => {
			this.loading = false;
			this.AddNotification(resp.status, resp.status === 'success' ? 'Successfully Removed Audience.' : resp.msg, 5000);
			this.Reload(() => this.init());
		}, (err) => {
			this.AddNotification('error', err, 5000);
			this.loading = false;
		});
	}
}
