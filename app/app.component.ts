import { Component } from '@angular/core';
import { provideRouter, RouterConfig, ROUTER_DIRECTIVES } from '@angular/router';
import { SignInComponent } from './signin.component';

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
		path: 'signIn',
		component: SignInComponent
	},
];

@Component({
	selector: 'sway-app',
	template : `<router-outlet></router-outlet>`
})
export class AppComponent {}
