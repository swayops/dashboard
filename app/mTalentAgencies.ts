import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';

import * as U from './utils';

@Component({
	selector: 'media-agencies',
	template: require('./views/mTalentAgencies.html'),
	pipes: [ U.FilterArrayPipe ]
})

export class TalentAgenciesCmp  extends ManageBase {
	constructor(title: Title, api: Sway) {
		super('getAllTalentAgencies', 'Talent Agencies', title, api);
	}
}
