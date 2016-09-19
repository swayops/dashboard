import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';

@Component({
	selector: 'dashboard',
	templateUrl: './views/dashboard.html',
})

export class DashboardCmp {
	private data = {};
	constructor(title: Title, private api: Sway) {
		if (!api.CurrentUser.admin) {
			api.GoTo('/reporting', api.CurrentUser.id);
		}
		title.setTitle('Sway :: Dashboard');
		this.api.Get('getAdminStats', data => this.data = data);
	}
}
