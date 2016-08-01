import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';

@Component({
	selector: 'check-payouts',
	template: require('./views/checkPayouts.html')
})

export class CheckPayoutsCmp {
	constructor(title: Title, private api: Sway) {
		title.setTitle("Sway :: Check Payouts");
	}
}

