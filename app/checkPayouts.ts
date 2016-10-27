import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';

@Component({
	selector: 'check-payouts',
	templateUrl: './views/checkPayouts.html'
})
export class CheckPayoutsCmp extends ManageBase {
	constructor(title: Title, api: Sway) {
		super('getPendingChecks', 'Check Payouts', title, api);
	}

	address(inf: { address: any }) {
		const addr = inf.address;
		if (!addr) return 'N/A';
		return [
			addr.address_line1, addr.address_line2, addr.address_city, addr.address_state,
			addr.address_zip, addr.address_country,
		].filter(v => !!v && v.length).join(', ');
	}

	approve(id: string) {
		this.api.Get('approveCheck/' + id, (resp) => {
			this.AddNotification(resp.status, resp.status === 'error' ? resp.message : 'Approved!');
			this.Reload();
		});
	}
}

