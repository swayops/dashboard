import { Component } from '@angular/core';

import { Sway, HasAPI } from './sway';

@Component({
	selector: 'left-nav',
	templateUrl: './views/leftNav.html',
})
export class LeftNavCmp extends HasAPI {
	constructor(api: Sway) { super(api); }
}

@Component({
	selector: 'user-header',
	templateUrl: './views/header.html',
})
export class HeaderCmp extends HasAPI {
	constructor(api: Sway) { super(api); }
}

@Component({
	selector: 'user-footer',
	templateUrl: './views/footer.html',
})

export class FooterCmp extends HasAPI {
	constructor(api: Sway) { super(api); }
}
