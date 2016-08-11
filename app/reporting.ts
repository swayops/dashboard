import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';

declare function initChartData();
declare function initChartData2();

@Component({
	selector: 'advertisers',
	templateUrl: './views/reporting.html'
})

export class ReportingCmp {
	private data;
	constructor(title: Title, private api: Sway, route: ActivatedRoute) {
		title.setTitle("Sway :: Reporting");
		const id = route.snapshot.params['id'];
		if (!id) {
			console.error('bad id', id);
			return;
		}
		api.SetCurrentUser(id);
	}

	ngOnInit() {
		try {
			initChartData();
			initChartData2();
		} catch(e) { console.error(e); };
	}

	Edit(uid: string) {
		console.warn('n/a');
	}

	Delete(uid: string) {
		console.warn('n/a');
	}
}
