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

const noNavURLs = {
	'/login': true,
	'/signUp': true,
	'/forgotPassword': true,
};

@Component({
	selector: 'sway-app',
	templateUrl: './views/app.html',
})
export class AppComponent extends HasAPI {
	private noNav: boolean;
	constructor(api: Sway, router: Router, loc: Location, route: ActivatedRoute) {
		super(api);

		let lastRoute: string;
		router.events.subscribe((evt: any) => {
			if (evt instanceof NavigationStart) {
				this.noNav = !!noNavURLs[evt.url];
				if (lastRoute && lastRoute !== evt.url) {
					api.SetCurrentUser(null); // workaround for nav
				}
				return;
			}
			if (evt instanceof NavigationEnd) {
				this.reinitPageScripts();
				const baseCls = document.querySelector('#page-content > .grid-parent > .grid-parent').classList,
					doThree = document.querySelector('div[three-columns]');
				if(doThree) {
					baseCls.remove('grid-85');
					baseCls.add('grid-62');
				} else {
					baseCls.remove('grid-62');
					baseCls.add('grid-85');
				}
				if(!!this.api.CurrentUser) {
					document.body.classList.add('user-logged-in');
				} else {
					document.body.classList.remove('user-logged-in');
				}
				lastRoute = evt.url
				return;
			}
		});
	}

	updateTags() {
		var u = this.api.User,
			w = window,
			agile = w['_agile'],
			ic = w['Intercom'],
			ga = w['ga'],
			fbq = w['fbq'];

		agile.track_page_view();

		ic('reattach_activator');
		if (u) {
			ic('update', {
				app_id: "gtphmh27",
				name: u.name,
				email: u.email,
				created_at: u.createdAt * 1000 // go time is in seconds, js time is in ms, have to convert it.
			});
		} else {
			ic('update', { app_id: "gtphmh27" });
		}

		ga('send', 'pageview');
		fbq('track', 'PageView');
	}

	reinitUI() { // based on /static/js/swayops.js
		$("div[role=tooltip]").remove(); // workaround logout tooltip bug
		$(".ttip").tooltip();
		$("#shareCodeSection").hide();
		$("#saveGroupBut").click(function () {
			$("#shareCodeSection").show("slow");
		});

		$('.onoffswitch').click(function (this: {}) {
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

		$('#slct_perks').click(function (this: {}) {
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

		$('.onoffswitch').each(function (this: {}) {
			var cls = $(this).attr("data-for");
			if ($(this).find('input').attr('checked')) { }
			else {
				$('.' + cls).slideToggle();
			}
		});

		$(".prog-bar div").each(function (this: {}, index: number) {
			$(this).slider({
				orientation: "horizontal",
				range: "min",
				max: 100,
				value: parseInt($(this).attr('data')) || 0
			});
		});

		$('[noscroll]').on('scroll touchmove mousewheel', function (e) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		});
	}

	initIncrGroup() {
		$(".increment-group").append('<div class="btn-action"><div class="inc button">+</div><div class="dec button">-</div></div>');

		$(".increment-group .button").on("click", function (this: {}) {
			var $button = $(this);
			var oldValue = $button.parent().parent().find("input").val();

			if ($button.text() == "+") {
				var newVal = parseFloat(oldValue) + 1;
			} else {
				// Don't allow decrementing below zero
				if (oldValue > 0) {
					var newVal = parseFloat(oldValue) - 1;
				} else {
					newVal = 0;
				}
			}
			$button.parent().parent().find("input").val(newVal);
		});
	};

	initSliderRange() {
		$(".slider-range").each(function (this: {}, index: number) {
			$(this).slider({
				range: true,
				min: parseInt($(this).attr('data-min')) || 0,
				max: parseInt($(this).attr('data-max')) || 0,
				values: [$(this).attr('data-start'), $(this).attr('data-end')].map(parseInt),
				slide: function (this: {}, event, ui) {
					$(this).siblings().val(ui.values[0] + " - " + ui.values[1]);
				}
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
		this.initSliderRange
		this.reinitUI();
	}
}

