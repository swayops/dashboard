import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';

@Component({
	selector: 'dashboard',
	template: require('./views/dashboard.html')
})

export class DashboardCmp {
	constructor(private title: Title, private api: Sway) {
		title.setTitle("Sway :: Dashboard");
	}
}

