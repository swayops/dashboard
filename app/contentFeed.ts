import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';

@Component({
	selector: 'ContentFeed',
	templateUrl: './views/contentFeed.html',
})
export class ContentFeedCmp extends ManageBase {
	public currentSortKey: string = '';
	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		super('getAdvertiserContentFeed', '-Content Feed', title, api, route.snapshot.params['id']);
	}


	ban(infID: string) {
		this.api.Get('advertiserBan/' + this.id + '/' + infID, resp => {
			this.AddNotification(resp.status, resp.status === 'error' ? resp.message : 'Banned!');
			this.Reload();
		});
	}

	isBanned(infID: string): boolean {
		const blacklist = this.user.advertiser.blacklist || {};
		return blacklist[infID];
	}
}
