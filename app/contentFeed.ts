import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';
import * as V from './validators';

@Component({
	selector: 'ContentFeed',
	templateUrl: './views/contentFeed.html'
})
export class ContentFeedCmp extends ManageBase {
	private currentSortKey: string = '';
	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		super('getAdvertiserContentFeed', '-Content Feed', title, api, route.snapshot.params['id']);
	}


}
