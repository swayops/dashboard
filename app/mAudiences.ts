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
		super('audience', 'Audiences', title, api, null, () => this.init());
	}
	private init() {
		if (Array.isArray(this.list)) return;
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
		this.api.Delete('audience/' + id, (resp) => {
			this.loading = false;
			this.AddNotification(resp.status, resp.status === 'success' ? 'Successfully Removed Audience.' : resp.msg, 5000);
			this.Reload(() => this.init());
		}, (err) => {
			this.AddNotification('error', err, 5000);
			this.loading = false;
		});
	}
}
