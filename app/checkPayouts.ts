import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';

@Component({
	selector: 'check-payouts',
	template: require('./views/checkPayouts.html')
})
export class CheckPayoutsCmp extends ManageBase {
	constructor(title: Title, api: Sway) {
		super('getPendingChecks', 'Check Payouts', title, api);
	}

	address(inf: {address: any}) {
		console.log(inf);
		return inf.address ? (inf.address.address_country + ', ' + inf.address.address_state) : 'N/A';
	}
	checkPayout(inf: {id: string}) {
		console.log(inf);
	}
}

