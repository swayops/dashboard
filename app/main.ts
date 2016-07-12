/// <reference path="../typings/index.d.ts" />
import 'es6-shim';
import 'reflect-metadata';
import 'zone.js/dist/zone';

import { bootstrap } from '@angular/platform-browser-dynamic';
import { Title } from '@angular/platform-browser';
import { PLATFORM_DIRECTIVES, provide, enableProdMode } from '@angular/core';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { ROUTER_DIRECTIVES, provideRouter, } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';

import { ALL_ROUTES, AppComponent } from './app.component';

if (process.env.ENV === 'production') {
	enableProdMode();
}

bootstrap(AppComponent, [
	[provideRouter(ALL_ROUTES)],
	disableDeprecatedForms(),
	provideForms(),
	HTTP_PROVIDERS,
	provide(PLATFORM_DIRECTIVES, { useValue: ROUTER_DIRECTIVES, multi: true }),
	Title
]).catch((err: any) => console.error(err));
