// ShippingPerks
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway, HasAPI } from './sway';

@Component({
	selector: 'shippingPerks',
	templateUrl: './views/shippingPerks.html',
})
export class ShippingPerksCmp extends HasAPI {
	public id;
	constructor(title: Title, public api: Sway, route: ActivatedRoute) {
		super(api);
		this.id = route.snapshot.params['id'];
	}
}
