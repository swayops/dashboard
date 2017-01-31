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
	public curWeek: any = {};
	public lastWeek: any = {};
	public lastMonth: any = {};
	public timelines: Timeline[];
	private id;
	constructor(title: Title, public api: Sway, route: ActivatedRoute) {
		title.setTitle('Sway :: Reporting');
		this.id = route.snapshot.params['id'];
		if (!this.id) {
			console.error('bad id');
			return;
		}
		api.SetCurrentUser(this.id).then((_) => {
			this.api.Get('getAdvertiserStats/' + this.id + '/7/0', (data) => this.curWeek = data.total || {});
			this.api.Get('getAdvertiserStats/' + this.id + '/14/7', (data) => this.lastWeek = data.total || {});
			this.api.Get('getAdvertiserStats/' + this.id + '/30/0', (data) => {
				this.lastMonth = data || {};
				this.setGraph('engagements');
			});
			this.api.Get('getAdvertiserTimeline/' + this.id, (data) => this.setTimeline(data || {}));
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

	private setTimeline(data: { [key: string]: Timeline[] }) {
		const out = new Array<Timeline>();
		for (const [k, v] of Object.entries(data)) {
			let i = 0;
			for (const tl of v) {
				tl.title = k;
				tl.ts = (tl.ts * 1000) + i; // js date fix and sorting
				out.push(tl);
				i++;
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
	}
}


interface Timeline {
	title: string;
	msg: string;
	ts: number;
	link?: string;
}
