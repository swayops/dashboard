import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { ManageBase } from './manageBase';
import { ModalEvent } from './modal';
import { apiURL, Sway } from './sway';

declare var $: any;

@Component({
	selector: 'campaigns',
	templateUrl: './views/mCampaigns.html',
})
export class CampaignsCmp extends ManageBase {
	public selDateButtons = [
		{ name: 'Cancel', class: 'btn-blue ghost' },
		{ name: 'Download Report »', class: 'btn-info', click: (evt) => this.getReport(evt) },
	];

	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		super('getCampaignsByAdvertiser', 'Campaigns', title, api, route.snapshot.params['id'], (data) => console.log(data));
	}

	ngAfterViewInit() {
		$('input.dp').datepicker({
			dateFormat: 'yy-mm-dd',
		});
	}

	getReport(evt: ModalEvent) {
		evt.dlg.hide();
		const val = evt.value;

		if (!val.startDate || !val.endDate) {
			this.AddNotification('error', 'You must specify the start and end date.');
			return;
		}

		const parts = [evt.data.id, val.startDate, val.endDate],
			url = apiURL + 'getCampaignReport/' + parts.join('/') + '/report-' + parts.join('-') + '.xlsx';

		window.open(url);
	}

	budgetPercent(cmp: any, sign = true): number | string {
		const val = (this.cmpStats(cmp, 'spent') / cmp.budget) * 100;
		return sign ? val.toFixed(0) + '%' : val;
	}

	cmpStats(cmp: any, key: string): number {
		if (!cmp.stats || !cmp.stats.total) return 0;
		return cmp.stats.total[key] || 0;
	}

	expandInf(ele: HTMLElement) {
		ele.classList.add('expanded');
	}
}
