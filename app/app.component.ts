import { Component } from '@angular/core';
import { provideRouter, RouterConfig, ROUTER_DIRECTIVES } from '@angular/router';
import { SignInComponent } from './signin.component';

export const routes: RouterConfig = [
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

export const ALL_ROUTES = [provideRouter(routes)];

@Component({
	selector: 'sway-app',
	template : `<router-outlet></router-outlet>`,
	directives: [ROUTER_DIRECTIVES],
	precompile: [routes.map(r => r.component).filter(r => !!r)] // dynamically precompile all used route components
})

export class AppComponent {}
