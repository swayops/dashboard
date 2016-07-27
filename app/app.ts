import { Component } from '@angular/core';
import { provideRouter, RouterConfig, Router, NavigationEnd, Event } from '@angular/router';

import { Sway } from './sway';

import * as $ from 'jquery';

@Component({
	selector: 'sway-app',
	template: `<router-outlet></router-outlet>`
})

export class AppComponent {
	constructor(private api: Sway, private window: Window, router: Router) {
		router.events.filter(event => event instanceof NavigationEnd).subscribe((evt: Event) => this.reinitPageScripts());
	}

	updateTags() {
		var u = this.api.User,
			w = this.window,
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

		$(".prog-bar div").each(function (this:{}, index: number) {
			$(this).slider({
				orientation: "horizontal",
				range: "min",
				max: 100,
				value: parseInt($(this).attr('data')) || 0
			});
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
		this.updateTags();
		this.initIncrGroup();
		this.initSliderRange
		this.reinitUI();
	}

}
