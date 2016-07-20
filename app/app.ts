import { Component } from '@angular/core';
import { provideRouter, RouterConfig } from '@angular/router';

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
		component: DashboardCmp
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
	constructor() { }
}
