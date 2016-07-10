import 'rxjs/Rx';
import { bootstrap }    from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { HTTP_PROVIDERS } from '@angular/http';

import { ALL_ROUTES, AppComponent } from './app.component';
import { SignInComponent } from './signin.component';



enableProdMode();
bootstrap(AppComponent, [
	ALL_ROUTES,
	disableDeprecatedForms(),
	provideForms(),
	HTTP_PROVIDERS
]).catch((err: any) => console.error(err));

