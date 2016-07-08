import { Component } from '@angular/core';
import { SignInComponent } from './signin.component';

@Component({
	selector: 'sway-app',
	template : `
		<signIn></signIn>
	`,
	directives: [SignInComponent]
})

export class AppComponent {
}
