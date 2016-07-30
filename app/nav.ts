import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway, HasAPI } from './sway';

@Component({
	selector: 'left-nav',
	template: require('./views/leftNav.html'),
})
export class LeftNavCmp extends HasAPI {
	constructor(api: Sway) { super(api); }
}

@Component({
	selector: 'user-header',
	template: require('./views/header.html'),
})
export class HeaderCmp extends HasAPI {
	constructor(api: Sway) { super(api); }
}

@Component({
	selector: 'user-footer',
	template: require('./views/footer.html'),
})

export class FooterCmp extends HasAPI {
	constructor(api: Sway) { super(api); }
}
