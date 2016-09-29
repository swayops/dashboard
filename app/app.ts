import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';

import { Sway, HasAPI } from './sway';

import * as $ from 'jquery';

@Component({
	selector: 'not-found',
	templateUrl: './views/404.html',
})
export class NotFoundCmp {
	constructor(title: Title) {
		title.setTitle('Sway :: 404 :: Page Not Found');
	}
}

const noNavURLs = [
	'/login',
	'/signUp',
	'/forgotPassword',
	'/resetPassword/',
];

@Component({
	selector: 'sway-app',
	templateUrl: './views/app.html',
})
export class AppComponent extends HasAPI {
	public noNav: boolean;
	constructor(api: Sway, router: Router, loc: Location, route: ActivatedRoute) {
		super(api);
		const defaultClasses = 'content-holder center-widget grid-parent mobile-grid-100';
		let lastRoute: string;
		router.events.subscribe((evt: any) => {
			if (evt instanceof NavigationStart) {
				this.noNav = noNavURLs.some(url => evt.url.indexOf(url) === 0);
				if (lastRoute && lastRoute !== evt.url) {
					api.SetCurrentUser(null); // workaround for nav
				}
				return;
			}
			if (evt instanceof NavigationEnd) {
				this.api.IsLoggedIn.subscribe(v => {
					if (v) {
						document.body.classList.add('user-logged-in');
					} else {
						document.body.classList.remove('user-logged-in');
					}
					const content = document.querySelector('router-outlet ~ *'),
						firstChild = content.firstElementChild; // this is an ugly hack :(
					if (content.tagName === 'NOT-FOUND' || firstChild && firstChild.tagName !== 'DIV') {
						content.setAttribute('class', defaultClasses + (v ? ' grid-80' : ' grid-100'));
						content.setAttribute('style', 'display: block;');
					}
					setTimeout(() => this.reinitPageScripts(), 100);
				});
				lastRoute = evt.url;
				return;
			}
		});
	}

	updateTags() {
		let u = this.api.User,
			w = window,
			agile = w['_agile'],
			ic = w['Intercom'],
			ga = w['ga'],
			fbq = w['fbq'];

		agile.track_page_view();

		ic('reattach_activator');
		if (u) {
			ic('update', {
				app_id: 'gtphmh27',
				name: u.name,
				email: u.email,
				created_at: u.createdAt * 1000, // go time is in seconds, js time is in ms, have to convert it.
			});
		} else {
			ic('update', { app_id: 'gtphmh27' });
		}

		ga('send', 'pageview');
		fbq('track', 'PageView');
	}

	reinitUI() { // based on /static/js/swayops.js
		$('div[role=tooltip]').remove(); // workaround logout tooltip bug
		$('.ttip').tooltip();
		$('#shareCodeSection').hide();
		$('#saveGroupBut').click(function () {
			$('#shareCodeSection').show('slow');
		});

		$('.onoffswitch').click(function (this: {}) {
			let cls = $(this).attr('data-for');
			if ($(this).find('input').is(':checked')) {
				$('.' + cls).slideToggle();
			}
			if (cls === 'toggle-perks') {
				if ($('#perks').prop('checked')) {
					$('#perk').prop('checked', true);
					$('.perkLink').show();
				} else {

					$('#perk').prop('checked', false);
					$('.perkLink').hide();
				}
			}
		});

		$('#slct_perks').click(function (this: {}) {
			let cls = $(this).attr('data-for');
			$('.' + cls).slideToggle();
			if ($('#perks').prop('checked')) {
				$('#perks').prop('checked', false);
				$('.perkLink').hide();
			} else {
				$('#perks').prop('checked', true);
				$('.perkLink').show();
			}

		});

		$('.onoffswitch').each(function (this: {}) {
			const cls = $(this).attr('data-for'),
				checked = $(this).find('input').is(':checked');
			if (!checked) {
				$('.' + cls).slideToggle();
			}
		});

		$('.prog-bar div').each(function (this: {}, index: number) {
			$(this).slider({
				orientation: 'horizontal',
				range: 'min',
				max: 100,
				value: parseInt($(this).attr('data')) || 0,
			});
		});

		$('[noscroll]').on('scroll touchmove mousewheel', function (e) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		});
	}

	initIncrGroup() {
		$('.increment-group').append('<div class="btn-action"><div class="inc button">+</div><div class="dec button">-</div></div>');

		$('.increment-group .button').on('click', function (this: {}) {
			let $button = $(this);
			let oldValue = $button.parent().parent().find('input').val(), newVal = 0;

			if ($button.text() === '+') {
				newVal = parseFloat(oldValue) + 1;
			} else {
				// Don't allow decrementing below zero
				if (oldValue > 0) {
					let newVal = parseFloat(oldValue) - 1;
				} else {
					newVal = 0;
				}
			}
			$button.parent().parent().find('input').val(newVal);
		});
	};

	initSliderRange() {
		$('.slider-range').each(function (this: {}, index: number) {
			$(this).slider({
				range: true,
				min: parseInt($(this).attr('data-min')) || 0,
				max: parseInt($(this).attr('data-max')) || 0,
				values: [$(this).attr('data-start'), $(this).attr('data-end')].map(parseInt),
				slide: function (this: {}, event, ui) {
					$(this).siblings().val(ui.values[0] + ' - ' + ui.values[1]);
				},
			});
		});

		$('.notification .fui-cross').click(function (this: {}) {
			$(this).parent().fadeOut(450);
		});
	}

	reinitPageScripts() {
		this.api.error = null;
		this.updateTags();
		this.initIncrGroup();
		this.initSliderRange();
		this.reinitUI();
	}
}

