import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { APIService } from './api';

@Component({
	selector: 'dashboard',
	template: require('./views/dashboard.html')
})

export class DashboardCmp {
	private user = {
		name: "Test User",
		profilePhoto: '/static/img/user.png',
		isAdmin: true,
	};
	constructor(private api: APIService) { }
}

