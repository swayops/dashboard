import { Component } from '@angular/core';
import { provideRouter, RouterConfig } from '@angular/router';

import { Four04Component } from './404';
import { LoginComponent } from './login';
import { SignUpComponent } from './signup';

export const ALL_ROUTES: RouterConfig = [
	{
		path: '',
		redirectTo: '/dashboard',
		pathMatch: 'full'
	},
	// {
	// 	path: 'dashboard',
	// 	component: DashboardComponent
	// },
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'signup',
		component: SignUpComponent
	},
	{
		path: '**',
		component: Four04Component
	}
];

@Component({
	selector: 'sway-app',
	template: `<router-outlet></router-outlet>`
})

export class AppComponent {
	constructor() { }
}
