import { Component, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Sway, HasAPI } from './sway';
import { Form } from './form';

@Component({
	selector: 'create-advertiser',
	template: './views/createAdvertiser.html',
})

export class CreateAdvertiserCmp extends HasAPI {
	private data = {};
	private fields = [
		{ title: 'Account Name', placeholder: 'Your brand or name', input: 'text', name: 'name', req: true,
			pattern: /^\w\w+$/, error: 'Please provide a name' },
		{ title: 'Email', placeholder: 'Your email, used for login', input: 'email', name: 'email', req: true,
			pattern: /^.+@.+$/, error: 'Please provide a valid email address.' },
		{ title: 'Password', placeholder: 'Your password', input: 'password', name: 'pass', req: true },
		{ title: 'Phone', placeholder: 'Your primary phone number', input: 'text', name: 'phone' }
	];

	save() {
		console.log(arguments);
	}

	constructor(title: Title, api: Sway, route: ActivatedRoute) {
		super(api);
		title.setTitle("Sway :: Create Advertiser");
		const id = route.snapshot.params['id'];
	}

	log(v) { console.log(v) }
}

