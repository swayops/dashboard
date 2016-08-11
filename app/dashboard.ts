import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';

@Component({
	selector: 'dashboard',
	templateUrl: './views/dashboard.html'
})

export class DashboardCmp {
	constructor(title: Title, private api: Sway) {
		title.setTitle("Sway :: Dashboard");
	}
}

