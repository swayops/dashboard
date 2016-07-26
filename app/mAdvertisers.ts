import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';

import * as U from './utils';

@Component({
	selector: 'advertisers',
	template: require('./views/mAdvertisers.html')
})

export class AdvertisersCmp implements OnInit {
	private advertisers;
	constructor(private title: Title, private api: Sway, private route: ActivatedRoute) {
		title.setTitle("Sway :: Manage Advertisers");
	}

	ngOnInit() {
		var id = this.route.snapshot.params['id'];
		if(!id) return console.error('bad id', id);
		this.api.Get('getAdvertisersByAgency/' + id, data => this.advertisers = data || [], err => console.error(err));
	}

	Edit(uid: string) {
		console.warn('n/a');
	}

	Delete(uid: string) {
		console.warn('n/a');
	}

	get TsToDate() {
		return U.TsToDate;
	}
}
