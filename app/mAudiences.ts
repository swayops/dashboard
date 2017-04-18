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
		super('audience', 'Audiences', title, api, null, () => {
			if (Array.isArray(this.list)) return;
			const list = [];
			for (const k of Object.keys(this.list).sort()) {
				const o = this.list[k];
				o.sub = Object.keys(o.members).length;
				list.push(o);
			}
			this.list = list;
		});
	}
}
