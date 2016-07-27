import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';

import * as U from './utils';

declare function initChartData();
declare function initChartData2();

@Component({
	selector: 'advertisers',
	template: require('./views/reporting.html'),
	pipes: [U.FilterArrayPipe]
})

export class ReportingCmp {
	private data;
	constructor(private title: Title, private api: Sway, route: ActivatedRoute) {
		title.setTitle("Sway :: Manage Advertisers");
		var id = route.snapshot.params['id'];
		if (!id) {
			console.error('bad id', id);
			return;
		}
		console.log(id)
		//this.api.Get('getAdvertisersByAgency/' + id, data => this.advertisers = data, err => console.error(err));
	}

	ngOnInit() {
		initChartData();
		initChartData2();
	}

	Edit(uid: string) {
		console.warn('n/a');
	}

	Delete(uid: string) {
		console.warn('n/a');
	}
}
