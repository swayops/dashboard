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
		{ name: 'Download XLSX »', class: 'btn-info', click: (evt) => this.getReport(evt) },
		{ name: 'Download Pretty PDF »', class: 'btn-info', click: (evt) => this.getReport(evt, true) },
	];

	public delInfButtons = [
		{ name: 'No', class: 'btn-blue ghost' },
		{ name: 'Yes', class: 'btn-danger', click: (evt) => this.removeInf(evt) },
	];

	public campaignCycles = {};

	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		super('getCampaignsByAdvertiser', 'Campaigns', title, api, route.snapshot.params['id'], (resp) => this.reloadCycles(resp));
	}

	ngAfterViewInit() {
		$('input.dp').datepicker({
			dateFormat: 'yy-mm-dd',
		});
	}

	getReport(evt: ModalEvent, pdf = false) {
		evt.dlg.hide();
		const val = evt.value;

		if (!val.startDate || !val.endDate) {
			this.AddNotification('error', 'You must specify the start and end date.');
			return;
		}

		const parts = [evt.data.id, val.startDate, val.endDate],
			url = apiURL + 'getCampaignReport/' + parts.join('/') + '/report-' + parts.join('-') + (pdf ? '.pdf?pdf=true' : '.xlsx');

		window.open(url);
	}

	reloadCycles = (resp: any) => {
		for (const cmp of this.list) {
			this.api.Get('getCycle/' + cmp.id, (data) => this.campaignCycles[cmp.id] = data || {});
		}
	}

	removeInf(evt: ModalEvent) {
		evt.dlg.hide();
		const data = evt.data;
		this.loading = true;
		this.api.Get('unassignDeal/' + data.infID + '/' + data.cmpID + '/' + data.dealID, (resp) => {
			this.loading = false;
			this.Reload(this.reloadCycles);
			this.AddNotification('success', 'Removed ' + data.name, 5000);
			this.ScrollToTop();
		}, (err) => {
			this.loading = false;
			this.AddNotification('error', err.msg);
		});
	}

	delCampaign(id: string) {
		if (!confirm('Are you sure you want to delete this campaign?')) {
			return;
		}
		this.loading = true;
		this.api.Delete('campaign/' + id, (resp) => {
			this.loading = false;
			this.AddNotification(resp.status, resp.status === 'success' ? 'Successfully Removed Campaign.' : resp.msg, 5000);
			this.Reload(this.reloadCycles);
		}, (err) => {
			this.AddNotification('error', err, 5000);
			this.loading = false;
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

	cycleClassName(cID: string, fld: string): string {
		const cycle = this.campaignCycles[cID] || {},
			val = cycle[fld] || 0,
			idx = cyclesOrder.indexOf(fld);
		if (val === 0) return 'palette-silver';
		if (idx < 1) return 'palette-wet-asphalt';
		return !!cycle[cyclesOrder[idx - 1]] ? 'palette-wet-asphalt' : 'palette-alizarin';
	}
}

const cyclesOrder = ['matched', 'notified', 'accepted', 'perks', 'completed'];
