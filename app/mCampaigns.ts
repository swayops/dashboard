import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { ManageBase } from './manageBase';
import { ModalEvent } from './modal';
import { apiURL, Sway } from './sway';

declare const $: any;

@Component({
	selector: 'campaigns',
	templateUrl: './views/mCampaigns.html',
})
export class CampaignsCmp extends ManageBase {
	public selDateButtons = [
		{ name: 'Cancel', class: 'btn-blue ghost' },
		{ name: 'Download Report »', class: 'btn-info', click: (evt) => this.getReport(evt) },
	];

	public delInfButtons = [
		{ name: 'No', class: 'btn-blue ghost' },
		{ name: 'Yes', class: 'btn-danger', click: (evt) => this.removeInf(evt) },
	];

	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		super('getCampaignsByAdvertiser', 'Campaigns', title, api, route.snapshot.params['id']);
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

	removeInf(evt: ModalEvent) {
		evt.dlg.hide();
		const data = evt.data;
		this.loading = true;
		this.api.Get('unassignDeal/' + data.infID + '/' + data.cmpID + '/' + data.dealID, (resp) => {
			this.loading = false;
			this.Reload();
			this.AddNotification('success', 'Removed ' + data.name, 5000);
			this.ScrollToTop();
		}, (err) => {
			this.loading = false;
			this.AddNotification('error', err.msg);
		});
	}

	budgetPercent(cmp: any, sign = true): number | string {
		let val = (cmp.spent / (cmp.spent + cmp.remaining)) * 100;
		if (isNaN(val)) val = 0;
		return sign ? val.toFixed(0) + '%' : val;
	}

	cmpStats(cmp: any, key: string): number {
		if (!cmp.stats || !cmp.stats.total) return 0;
		return cmp.stats.total[key] || 0;
	}

	expandInf(ele: HTMLElement) {
		ele.classList.add('expanded');
	}

	approveMedia(cmpID: string, infID: string) {
		this.loading = true;
		this.api.Get('approveSubmission/' + this.id + '/' + cmpID + '/' + infID, (resp) => {
			this.loading = false;
			this.Reload();
			this.AddNotification('success', 'Approved Submission', 5000);
			this.ScrollToTop();
		}, (err) => {
			this.loading = false;
			this.AddNotification('error', err.msg);
		});
	}

}
