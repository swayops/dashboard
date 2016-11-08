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
	private banned = {};
	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		super('getAdvertiserContentFeed', '-Content Feed', title, api, route.snapshot.params['id'],
			() => this.initData());
	}

	initData() {
		for (let v of this.list) {
			if (!v.socialImage) {
				// v.socialImage = defaultImages[Math.floor(Math.random() * defaultImages.length)];
				v.socialImage = '/static/img/defaultContentFeed.jpg';
			}
		}
		this.SortBy('infID', true);
	}
	ban(infID: string) {
		this.api.Get('advertiserBan/' + this.id + '/' + infID, resp => {
			this.AddNotification(resp.status, resp.status === 'error' ? resp.message : 'Banned!');
			this.banned[infID] = true;
			this.Reload();
		});
	}

	isBanned(infID: string): boolean {
		if (!this.user || !this.user.advertiser) return this.banned[infID];
		const blacklist = this.user.advertiser.blacklist || {};
		return blacklist[infID] || this.banned[infID];
	}
}


// const defaultImages = [1, 2, 3, 4, 5, 6].map(v => '/images/campaign/default_' + v + '.jpg');
