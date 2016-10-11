import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway, apiURL } from './sway';
import { ManageBase } from './manageBase';
import { ModalEvent } from './modal';

@Component({
	selector: 'campaigns',
	templateUrl: './views/mCampaigns.html',
})
export class CampaignsCmp extends ManageBase {
	public selDateButtons = [
		{name: 'Cancel', class: 'btn-blue ghost'},
		{name: 'Download Report »', class: 'btn-info', click: evt => this.getReport(evt)},
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
}
