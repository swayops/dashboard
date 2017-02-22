import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { ManageBase } from './manageBase';
import { Sway } from './sway';

import { ModalEvent } from './modal';

declare var $: any;

@Component({
	selector: 'ContentFeed',
	templateUrl: './views/contentFeed.html',
})
export class ContentFeedCmp extends ManageBase {
	public currentSortKey: string = '';

	public urlButtons = [
		{ name: 'Cancel', class: 'btn-blue ghost' },
		{ name: 'Add Bonus', class: 'btn-info', click: (evt) => this.addBonus(evt) },
	];

	private banned = {};

	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		super('getAdvertiserContentFeed', '-Content Feed', title, api, route.snapshot.params['id'],
			() => this.initData());
	}

	initData() {
		for (const v of this.list) {
			if (!v.socialImage) {
				// v.socialImage = defaultImages[Math.floor(Math.random() * defaultImages.length)];
				v.socialImage = '/static/img/defaultContentFeed.jpg';
			}
		}
		this.SortBy('infID', true);
		$('.auditRow > .ttip').tooltip();
	}

	ban(infID: string) {
		this.api.Get('advertiserBan/' + this.id + '/' + infID, (resp) => {
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

	addBonus(evt: ModalEvent) {
		const it = evt.data,
			url = evt.value.url,
			payload = {
				cmpID: it.campaignID,
				infID: it.infID,
				url: url,
			};
		this.api.Post('addBonus', payload, (resp) => {
			this.AddNotification('success', 'Successfully Added Bonus Post URL!');
			this.ScrollToTop();
		}, (err) => {
			this.AddNotification('error', err.msg);
			this.ScrollToTop();
		});

		evt.Hide();
	}
}

// const defaultImages = [1, 2, 3, 4, 5, 6].map(v => '/images/campaign/default_' + v + '.jpg');
