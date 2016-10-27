// AssignGame
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway, HasAPI } from './sway';
import { AlphaCmp, NumCmp } from './utils';

@Component({
	selector: 'assignGame',
	templateUrl: './views/assignGame.html',
})
export class AssignGameCmp extends HasAPI {
	private incompleteInfs: any[];
	public categories = [];
	public loading = false;

	public inf: any;

	constructor(title: Title, public api: Sway) {
		super(api);
		title.setTitle('Assign Game');
		this.api.Get('getCategories', resp => {
			this.categories = (resp || []).sort((a, b) => AlphaCmp(a.cat, b.cat) ); // sort by name
		});
		this.api.Get('getIncompleteInfluencers', resp => {
			this.incompleteInfs = (resp || []).sort((a, b) => NumCmp(a.id, b.id));
			if (resp && resp.length) this.next();
		});
	}

	next() {
		if (!this.incompleteInfs.length) {
			this.inf = null;
			return;
		}
		const inf = this.incompleteInfs.shift();
		inf.categories = inf.categories || {};
		if (inf.male && inf.female) {
			inf.gender = 'unicorn';
		} else if (inf.male) {
			inf.gender = 'm';
		} else if (inf.female) {
			inf.gender = 'f';
		}
		this.inf = inf;
	}

	assign() {
		this.loading = true;
		const id = this.inf.id,
			data = {
				categories: Object.keys(this.inf.categories),
				gender: this.inf.gender,
			};
		this.api.Put('setAudit/' + id, data, resp => {
			this.loading = false;
			this.ScrollToTop();
			this.AddNotification('success', 'Updated Influencer', 2000);
			this.next();
		}, err => {
			this.loading = false;
			this.ScrollToTop();
			this.AddNotification('error', err.msg);
		});
	}

	ban() {
		this.api.Post('setBan/' + this.inf.id + '/true', {}, resp => {
			this.loading = false;
			this.ScrollToTop();
			this.AddNotification('success', 'Banned the naughty influencer!', 2000);
			this.next();
		}, err => {
			this.loading = false;
			this.ScrollToTop();
			this.AddNotification('error', err.msg);
		});
	}
}