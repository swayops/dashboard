import { bootstrap } from '@angular/platform-browser-dynamic';
import { Title } from '@angular/platform-browser';
import { PLATFORM_DIRECTIVES, provide, enableProdMode, ExceptionHandler } from '@angular/core';
import { disableDeprecatedForms, provideForms, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { ROUTER_DIRECTIVES, provideRouter, RouterConfig } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';

import { AppComponent, NotFoundCmp } from './app';
import { AuthGuard, Sway } from './sway';

import { LoginCmp } from './login';
import { SignUpCmp } from './signup';
import { ForgotPasswordCmp } from './forgotPassword';

import { DashboardCmp } from './dashboard';
import { MediaAgenciesCmp } from './mAgencies';
import { AdvertisersCmp } from './mAdvertisers';
import { ReportingCmp } from './reporting';
import { TalentAgenciesCmp } from './mTalentAgencies';

import { HeaderCmp, FooterCmp, LeftNavCmp } from './nav';

declare var PRODUCTION: boolean;

if (PRODUCTION) {
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
		path: 'reporting/:id',
		component: ReportingCmp,
		canActivate: [AuthGuard]
	},
	{
		path: 'mTalentAgencies',
		component: TalentAgenciesCmp,
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
		component: NotFoundCmp
	}
];

// look more into this
class MyExceptionHandler extends ExceptionHandler {
	call(error, stackTrace = null, reason = null) {
		console.log(error)
		console.log(stackTrace)
		console.log(reason)
	}
}


bootstrap(AppComponent, [
	disableDeprecatedForms(),
	provideForms(),
	[provideRouter(ALL_ROUTES)],
	HTTP_PROVIDERS,
	provide(PLATFORM_DIRECTIVES, { useValue: ROUTER_DIRECTIVES, multi: true }),
	provide(PLATFORM_DIRECTIVES, { useValue: HeaderCmp, multi: true }),
	provide(PLATFORM_DIRECTIVES, { useValue: LeftNavCmp, multi: true }),
	provide(PLATFORM_DIRECTIVES, { useValue: FooterCmp, multi: true }),
	{provide: ExceptionHandler, useClass: MyExceptionHandler},
	Title,
	Sway,
	AuthGuard
]);

