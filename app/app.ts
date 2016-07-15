import { Component } from '@angular/core';
import { provideRouter, RouterConfig, ROUTER_DIRECTIVES } from '@angular/router';
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
		redirectTo: '/404'
		//component: NotFound
	}
];

@Component({
	selector: 'sway-app',
	template : `<router-outlet></router-outlet>`
})
export class AppComponent {}
