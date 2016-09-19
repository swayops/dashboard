import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';

declare function initChartData();
declare function initChartData2();

@Component({
	selector: 'reporting',
	templateUrl: './views/reporting.html',
})

export class ReportingCmp {
	public curWeek: any = {};
	public lastWeek: any = {};
	constructor(title: Title, public api: Sway, route: ActivatedRoute) {
		title.setTitle('Sway :: Reporting');
		const id = route.snapshot.params['id'];
		if (!id) {
			console.error('bad id', id);
			return;
		}
		api.SetCurrentUser(id);
		this.api.Get('getAdvertiserStats/' + id + '/7/0', data => this.curWeek = data.total);
		this.api.Get('getAdvertiserStats/' + id + '/14/7', data => this.lastWeek = data.total);
	}

	ngOnInit() {
		try {
			initChartData();
			// initChartData2();
		} catch (e) { console.error(e); }

		console.log(this);
	}
}
