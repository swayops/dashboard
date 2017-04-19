import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { Sway } from './sway';

declare function initChartData(data: any[]);
declare function initChartData2();

@Component({
	selector: 'reporting',
	templateUrl: './views/reporting.html',
})

export class ReportingCmp {
	public lastMonth: any = { total: {} };
	public timelines: Timeline[];
	public adminMessages: any[];

	private id;
	constructor(title: Title, public api: Sway, route: ActivatedRoute) {
		title.setTitle('Sway :: Reporting');
		this.id = route.snapshot.params['id'];
		if (!this.id) {
			console.error('bad id');
			return;
		}
		api.SetCurrentUser(this.id).then((_) => {
			this.api.Get('getAdvertiserStats/' + this.id + '/30/0', (data) => {
				this.lastMonth = data || { total: {} };
				if (!this.lastMonth.total) {
					this.lastMonth.total = {};
				}
				this.setGraph('engagements');
			});
			this.api.Get('getAdvertiserTimeline/' + this.id, (data) => this.setTimeline(data || {}), (err) => console.log(err));
		}).catch((err) => {
			api.Logout();
		});
	}

	setGraph(key) {
		try {
			const data = this.lastMonth;
			initChartData(Object.keys(data).map((k) => {
				if (k === 'total') return null;
				return { date: k, value: data[k][key] || 0 };
			}).filter((v) => !!v));
		} catch (e) { console.error(e); }
	}

	private setTimeline(data: { [key: string]: any }) {
		console.log(data);
		const out = new Array<Timeline>(),
			admin = new Array<any>();
		for (const k of Object.keys(data)) {
			const v = data[k];
			if (!Array.isArray(v)) { // pending
				v.name = k;
				admin.push(v);
				continue;
			}
			for (const tl of v) {
				tl.title = k;
				tl.ts = (tl.ts * 1000); // js date fix and sorting
				out.push(tl);
			}
		}
		out.sort((a, b) => {
			if (!a) return -1;
			if (!b) return 1;
			if (a.ts < b.ts) return -1;
			if (a.ts > b.ts) return 1;
			return 0;
		});
		this.timelines = out;
		this.adminMessages = admin;
	}

	get hasNoCampaigns() {
		if (!!this.timelines && this.timelines.length > 0)
			return !this.timelines;
	}
}

interface Timeline {
	title: string;
	msg: string;
	ts: number;
	link?: string;
}
