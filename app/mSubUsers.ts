// MSubUsers
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ManageBase } from './manageBase';
import { Sway } from './sway';

@Component({
	selector: 'mSubUsers',
	templateUrl: './views/mSubUsers.html',
})
export class SubUsersCmp extends ManageBase {
	public totalUsers: any = 0;
	public availUsers: any = 0;
	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		super('subUsers', 'Manage Users', title, api, route.snapshot.params['id'], (resp) => this.init(resp));
	}

	private init(resp) {
		switch (this.user.advertiser.planID) {
			case 1:
				this.totalUsers = 1; break;
			case 2:
				this.totalUsers = 5; break;
			case 3:
				this.totalUsers = 'Unlimited';
				this.availUsers = this.totalUsers;
				break;
			default:
		}
		if (this.availUsers === 0) this.availUsers = this.totalUsers - this.list.length;
	}

	removeUser(email: string) {
		this.loading = true;
		this.api.Delete('subUsers/' + this.user.id + '/' + email, (resp) => {
			this.loading = false;
			this.AddNotification(resp.status, resp.status === 'success' ? 'Successfully Removed User.' : resp.msg, 5000);
			this.Reload((nresp) => this.init(nresp));
		}, (err) => {
			this.AddNotification('error', err, 5000);
			this.loading = false;
		});
	}

	addUser(v: any) {
		this.loading = true;
		this.api.Post('subUsers/' + this.user.id, v, (resp) => {
			this.loading = false;
			this.AddNotification(resp.status, resp.status === 'success' ? 'Successfully Added User.' : resp.msg, 5000);
			this.Reload((nresp) => this.init(nresp));
		}, (err) => {
			this.AddNotification('error', err, 5000);
			this.loading = false;
		});
	}
}
