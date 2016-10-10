import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';

declare function initChartData(data: any[]);
declare function initChartData2();

@Component({
	selector: 'reporting',
	templateUrl: './views/reporting.html',
})

export class ReportingCmp {
	public curWeek: any = {};
	public lastWeek: any = {};
	public lastMonth: any = {};
	private id;
	constructor(title: Title, public api: Sway, route: ActivatedRoute) {
		title.setTitle('Sway :: Reporting');
		this.id = route.snapshot.params['id'];
		if (!this.id) {
			console.error('bad id');
			return;
		}
		api.SetCurrentUser(this.id);
		this.api.Get('getAdvertiserStats/' + this.id + '/7/0', data => this.curWeek = data.total || {});
		this.api.Get('getAdvertiserStats/' + this.id + '/14/7', data => this.lastWeek = data.total || {});
	}

	ngOnInit() {
		this.api.Get('getAdvertiserStats/' + this.id + '/30/0', data => {
			this.lastMonth = data || {};
			this.setGraph('engagements');
		});
	}

	setGraph(key) {
		try {
			const data = this.lastMonth;
			initChartData(Object.keys(data).map(k => {
				if (k === 'total') return null;
				return {date: k, value: data[k][key] || 0};
			}).filter(v => !!v));
		} catch (e) { console.error(e); }
	}
}
