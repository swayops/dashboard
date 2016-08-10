import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Title, BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode, ExceptionHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterConfig } from '@angular/router';
import { HttpModule } from '@angular/http';

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
import { CheckPayoutsCmp } from './checkPayouts';

import { HeaderCmp, FooterCmp, LeftNavCmp } from './nav';

import { FilterArrayPipe } from './utils';

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
		path: 'checkPayouts',
		component: CheckPayoutsCmp,
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


@NgModule({
	declarations: [
		AppComponent, // app

		// components
		HeaderCmp, LeftNavCmp, FooterCmp,
		DashboardCmp, LoginCmp, SignUpCmp,
		ForgotPasswordCmp, NotFoundCmp, MediaAgenciesCmp,
		AdvertisersCmp, ReportingCmp, TalentAgenciesCmp,
		CheckPayoutsCmp,

		// pipes and utils
		FilterArrayPipe
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot(ALL_ROUTES),
		FormsModule,
		HttpModule,
	],
	providers: [
		Title,
		Sway,
		AuthGuard
	],
	bootstrap: [AppComponent],
})
export class AppModule { }


platformBrowserDynamic().bootstrapModule(AppModule);
