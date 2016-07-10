import 'rxjs/Rx';
import { bootstrap }    from '@angular/platform-browser-dynamic';
import { Title } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { HTTP_PROVIDERS } from '@angular/http';

import { ALL_ROUTES, AppComponent } from './app.component';

// enableProdMode();
bootstrap(AppComponent, [
	ALL_ROUTES,
	disableDeprecatedForms(),
	provideForms(),
	HTTP_PROVIDERS,
	Title
]).catch((err: any) => console.error(err));

