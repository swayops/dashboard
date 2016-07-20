import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { APIService } from './api';

@Component({
	selector: 'left-nav',
	template: require('./views/leftNav.html'),
})
export class LeftNavCmp {
	private user;

	constructor(api: APIService) { this.user = api.User; }
}

@Component({
	selector: 'user-header',
	template: require('./views/header.html'),
})
export class HeaderCmp {
	private user;

	constructor(private api: APIService) { this.user = api.User; }
}

@Component({
	selector: 'user-footer',
	template: require('./views/footer.html'),
})
export class FooterCmp {
	constructor(private api: APIService) { }
}

