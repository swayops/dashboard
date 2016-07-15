/// <reference path="../typings/index.d.ts" />

import { bootstrap } from '@angular/platform-browser-dynamic';
import { Title } from '@angular/platform-browser';
import { PLATFORM_DIRECTIVES, provide, enableProdMode } from '@angular/core';
import { disableDeprecatedForms, provideForms, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { ROUTER_DIRECTIVES, provideRouter, } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';

import { ALL_ROUTES, AppComponent } from './app';
import { APIService } from './api';

if (process.env.ENV === 'production') {
	enableProdMode();
}

bootstrap(AppComponent, [
	[provideRouter(ALL_ROUTES)],
	disableDeprecatedForms(),
	provideForms(),
	HTTP_PROVIDERS,
	provide(PLATFORM_DIRECTIVES, { useValue: ROUTER_DIRECTIVES, multi: true }),
	//provide(PLATFORM_DIRECTIVES, { useValue: REACTIVE_FORM_DIRECTIVES, multi: true }),
	Title,
	APIService
]).catch((err: any) => console.error(err));
