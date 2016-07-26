import { Component } from '@angular/core';
import { provideRouter, RouterConfig, Router, NavigationEnd, Event } from '@angular/router';

import { AuthGuard, Sway } from './sway';

import { Four04Cmp } from './404';
import { LoginCmp } from './login';
import { SignUpCmp } from './signup';
import { ForgotPasswordCmp } from './forgotPassword';

import { DashboardCmp } from './dashboard';
import { MediaAgenciesCmp } from './mAgencies';

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
		path: 'mAgencies',
		component: MediaAgenciesCmp,
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
	constructor(private api: Sway, private window: Window, router: Router) {
		router.events.filter(event => event instanceof NavigationEnd).subscribe((evt:Event) => {
			this.updateTags();
			this.reinitUI();
		});
	}


	private updateTags() {
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

	private reinitUI() { // based on /static/js/swayops.js
		var $ = jQuery;
		$(".ttip").tooltip();
		$("#shareCodeSection").hide();
		$("#saveGroupBut").click(function() {
			$("#shareCodeSection").show("slow");
		});

		$('.onoffswitch').click(function() {
			var cls = $(this).attr("data-for");
			if ($(this).find('input').is(":checked")) {
				$('.' + cls).slideToggle();
			}
			if (cls == 'toggle-perks') {
				if ($('#perks').prop('checked')) {
					$('#perk').prop('checked', true);
					$('.perkLink').show();
				} else {

					$('#perk').prop('checked', false);
					$('.perkLink').hide();
				}
			}
		});

		$('#slct_perks').click(function() {
			var cls = $(this).attr("data-for");
			$('.' + cls).slideToggle();
			if ($('#perks').prop('checked')) {
				$('#perks').prop('checked', false);
				$('.perkLink').hide();
			} else {
				$('#perks').prop('checked', true);
				$('.perkLink').show();
			}

		});

		$('.onoffswitch').each(function() {
			var cls = $(this).attr("data-for");
			if ($(this).find('input').attr('checked')) { }
			else {
				$('.' + cls).slideToggle();
			}
		});
	}
}

interface Window {
	intercomSettings: any;
	Intercom: any;
	_agile: any;
	ga: any;
	fbq: any;
	jQuery: any;
}
