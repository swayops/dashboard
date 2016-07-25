import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { APIService } from './api';

import { pad } from './helpers';

@Component({
	selector: 'media-agencies',
	template: require('./views/mAgencies.html')
})

export class MediaAgenciesCmp {
	private agencies;
	constructor(private title: Title, private api: APIService) {
		title.setTitle("Sway :: Manage Media Agencies");

		api.Get('getAllAdAgencies', data => this.agencies = data, err => console.error(err));
	}

	getDate(ts) {
		let d = new Date(ts * 1000),
			year = d.getFullYear(),
			month = pad(1 + d.getMonth()),
			day = pad(d.getDate());
		return year + '-' + month + '-' + day;
	}
}
