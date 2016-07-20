import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { APIService } from './api';

@Component({
	selector: 'left-nav',
	template: require('./views/leftNav.html'),
})

export class LeftNavCmp {
	private staticPath = '/static/';
	private _u;
	private error: any;

	constructor(private api: APIService) { }

	@Input() set user(u: any) {
		this._u = u || this.api.User;
	}

	get user() { return this._u; }
}

