import { Component, AfterViewChecked, ElementRef } from '@angular/core';

import { Sway, HasAPI, UserType } from './sway';

import { SearchData } from './utils';

import $ from 'jquery';

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
export class HeaderCmp extends HasAPI implements AfterViewChecked {
	private finishedInit = false;
	private userID: string;
	constructor(api: Sway, private ele: ElementRef) { super(api); }

	ngAfterViewChecked() { // this hacky but can't really cleanly do it
		const e = (<HTMLElement> this.ele.nativeElement).querySelector('#globalSearch');
		if (!e || !this.user) return;

		if (this.finishedInit) {
			if (this.userID === this.user.id) return;
			// if the "current user" changed, aka admin -> agency, reinit the search data
			this.setSearchData(e);
			return;
		}

		const $el = this.setSearchData(e);
		$el.on('select2:select', () => {
			const val = $el.val()[0];
			if (val.substr(0, 4) === 'http') {
				window.open(val, '_blank');
			} else {
				this.api.GoTo(val.substr(1));
			}
			$el.val('').change();
		});
		this.finishedInit = true;
	}

	private setSearchData(e: Element) {
		this.userID = this.user.id;

		const userData = SearchData[UserType(this.user)] || {},
			data = objectToList(userData, this.userID).concat(objectToList(SearchData.misc, this.userID));

		return $(e).empty().select2({
			data: data,
			dropdownAutoWidth: true,
			placeholder: 'What would you like to do?',
			allowClear: true,
			width: '100%',
		});
	}
}

@Component({
	selector: 'user-footer',
	templateUrl: './views/footer.html',
})
export class FooterCmp extends HasAPI {
	constructor(api: Sway) { super(api); }
}

function objectToList(obj: Object, id: string): any[] {
	return Object.keys(obj).map(k => { return { id: obj[k].replace(/:id/, id), text: k }; });
}

