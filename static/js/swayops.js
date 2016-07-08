/* SwayOps App, Copyright Swayops.com */
(function(win, tmpls) {
	'use strict';
	function pageReinit() {
		$(".ttip").tooltip({ track: true });

		$("#shareCodeSection").hide();
		$("#saveGroupBut").click(function() {
			$("#shareCodeSection").show("slow");
		});

		var cls;

		$('.onoffswitch').click(function() {
			cls = $(this).attr("data-for");
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
			cls = $(this).attr("data-for");
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
			cls = $(this).attr("data-for");
			if ($(this).find('input').attr('checked')) { }
			else {
				$('.' + cls).slideToggle();
			}
		});
	}

	function SwayOps(apiPath, templates) {
		if (!(this instanceof SwayOps)) return new SwayOps(routes);

		this.apiPath = apiPath;

		this.checkLoggedIn = this.checkLoggedIn.bind(this);

		this.initRouter();
	}

	SwayOps.prototype = {
		VERSION: 0.1,

		initRouter: function() {
			var self = this,
				checkAndRender = function(p, args) {
					var args = args || [];
					return function(pid) { self.checkLoggedIn(pid || p, args.concat(arguments)) };
				},
				routes = {
					'/login': function() { self.render('login'); },
					'/signup': function() { self.render('signup'); },
					'/:page': checkAndRender('/adminDash'),
				};

			this.users = [];
			this.router = new Router(routes).configure({
				notfound: self.notfound,
				html5history: true,
				run_handler_in_init: true,
				convert_hash_in_init: true,
			});

			this.router.init();
		},

		notfound: function notfound() {
			console.warn("not found", arguments, this);
		},

		checkLoggedIn: function(path, args) {
			console.log(this, this.isLoggedIn())
			if (!this.isLoggedIn()) {
				return this.router.setRoute('/login');
			}
			return this.render(path, args);
		},

		user: function() {
			var ln = this.users.length;
			if (ln > 0) return this.users[ln - 1];
			return null;
		},

		isLoggedIn: function() { return !!this.users.length; },

		get: function(templ, path, params) {
			$.ajax()
		},

		render: function(tmpl, params) {
			if (tmpl.length && tmpl[0] === '/') tmpl = tmpl.substr(1);
			if (!tmpls[tmpl]) return;
			params = params || {};
			params.staticPath = staticPath;
			params.user = this.user();
			$('main').html(Mustache.render(tmpls[tmpl], params, tmpls));
			if (params.user) { // TODO this is probably wrong, will have tofigure out which templates uses what
				$('body').removeClass('layout-2-column').addClass('layout-1-column')
			} else {
				$('body').removeClass('layout-1-column').addClass('layout-2-column')
			}
			initIncrGroup()
			initSliderRange()
			pageReinit();
		}
	};
	var $SO = win.$SO = new SwayOps();
	win.fakeLogin = function(page, user) {
		$SO.users = [user];
		$SO.router.setRoute(page);
	};
})(window, templates || {});