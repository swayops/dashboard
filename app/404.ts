import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
	selector: 'login',
	template: require('./views/404.html')
})
export class Four04Component {
	constructor(private title: Title) {
		title.setTitle("Sway :: 404 :: Page Not Found");
	}
}

