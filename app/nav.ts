import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { APIService } from './api';

@Component({
	selector: 'left-nav',
	template: require('./views/leftNav.html'),
})
export class LeftNavCmp {
	constructor(private api: APIService) {}

	get user() { return this.api.CurrentUser; }
}

@Component({
	selector: 'user-header',
	template: require('./views/header.html'),
})
export class HeaderCmp {
	constructor(private api: APIService) {}

	get user() { return this.api.CurrentUser; }
}

@Component({
	selector: 'user-footer',
	template: require('./views/footer.html'),
})
export class FooterCmp {
	constructor(private api: APIService) { }
	get user() { return this.api.CurrentUser; }
}

