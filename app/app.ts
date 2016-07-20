import { Component } from '@angular/core';
import { provideRouter, RouterConfig, Router, NavigationStart, Event } from '@angular/router';

import { AuthGuard, APIService } from './api';

import { DashboardCmp } from './dashboard';
import { Four04Cmp } from './404';
import { LoginCmp } from './login';
import { SignUpCmp } from './signup';
import { ForgotPasswordCmp } from './forgotPassword';

export const ALL_ROUTES: RouterConfig = [
	{
		path: '',
		redirectTo: '/dashboard',
		pathMatch: 'full'
	},
	{
		path: 'dashboard',
		component: DashboardCmp,
		canActivate: [AuthGuard]
	},
	{
		path: 'dashboard/:id',
		component: DashboardCmp,
		canActivate: [AuthGuard]
	},
	{
		path: 'login',
		component: LoginCmp
	},
	{
		path: 'signup',
		component: SignUpCmp
	},
	{
		path: 'forgotPassword',
		component: ForgotPasswordCmp
	},
	{
		path: 'resetPassword/:uuid',
		component: ForgotPasswordCmp
	},
	{
		path: '**',
		component: Four04Cmp
	}
];

@Component({
	selector: 'sway-app',
	template: `<router-outlet></router-outlet>`
})

export class AppComponent {
	constructor(private api: APIService, private window: Window, router: Router) {
		router.events.filter(event => event instanceof NavigationStart).subscribe((evt:Event) => this.updateTags(evt));
	}

	private updateTags(evt: Event) {
		var u = this.api.User,
			w = this.window,
			ic = w.Intercom;


		w._agile.track_page_view();

		ic('reattach_activator');
		if(u) {
			ic('update', {
				app_id: "gtphmh27",
				name: u.name,
				email: u.email,
				created_at: u.createdAt * 1000 // go time is in seconds, js time is in ms, have to convert it.
			});
		} else {
			ic('update', {app_id: "gtphmh27"});
		}

		w.ga('send', 'pageview');
		w.fbq('track', 'PageView');
	}
}


interface Window {
	intercomSettings: any;
	Intercom: any;
	_agile: any;
	ga: any;
	fbq: any;
}
