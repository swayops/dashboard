/// <reference path="../typings/index.d.ts" />

import { bootstrap } from '@angular/platform-browser-dynamic';
import { Title } from '@angular/platform-browser';
import { PLATFORM_DIRECTIVES, provide, enableProdMode } from '@angular/core';
import { disableDeprecatedForms, provideForms, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { ROUTER_DIRECTIVES, provideRouter, RouterConfig } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';

import { AppComponent } from './app';
import { AuthGuard, Sway } from './sway';

import { Four04Cmp } from './404';
import { LoginCmp } from './login';
import { SignUpCmp } from './signup';
import { ForgotPasswordCmp } from './forgotPassword';

import { DashboardCmp } from './dashboard';
import { MediaAgenciesCmp } from './mAgencies';
import { AdvertisersCmp } from './mAdvertisers';

import { HeaderCmp, FooterCmp, LeftNavCmp } from './nav';

if (process.env.ENV === 'production') {
	enableProdMode();
}

const ALL_ROUTES: RouterConfig = [
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
		path: 'mAdvertisers/:id',
		component: AdvertisersCmp,
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

bootstrap(AppComponent, [
	disableDeprecatedForms(),
	provideForms(),
	[provideRouter(ALL_ROUTES)],
	HTTP_PROVIDERS,
	provide(PLATFORM_DIRECTIVES, { useValue: ROUTER_DIRECTIVES, multi: true }),
	provide(PLATFORM_DIRECTIVES, { useValue: HeaderCmp, multi: true  }),
	provide(PLATFORM_DIRECTIVES, { useValue: LeftNavCmp, multi: true  }),
	provide(PLATFORM_DIRECTIVES, { useValue: FooterCmp, multi: true  }),
	provide(Window, { useValue: window }),
	//provide(PLATFORM_DIRECTIVES, { useValue: REACTIVE_FORM_DIRECTIVES, multi: true }),
	Title,
	Sway,
	AuthGuard
]).catch((err: any) => console.error(err));
