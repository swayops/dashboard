import { Component } from '@angular/core';
import { SignInComponent } from './signin.component';

@Component({
	selector: 'sway-app',
	template : `
		<h1>yay sway dashboard v2 before v1 even came out!</h1>
		<signIn></signIn>
	`,
	directives: [SignInComponent]
})

export class AppComponent {
}
