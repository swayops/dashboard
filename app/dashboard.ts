import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { APIService } from './api';

@Component({
	selector: 'dashboard',
	template: require('./views/dashboard.html')
})

export class DashboardCmp {
	constructor(private title: Title, private api: APIService) {
		title.setTitle("Sway :: Dashboard");
	}
}

