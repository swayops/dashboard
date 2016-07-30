import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Sway } from './sway';
import { ManageBase } from './manageBase';

import * as U from './utils';

@Component({
	selector: 'media-agencies',
	template: require('./views/mAgencies.html'),
	pipes: [ U.FilterArrayPipe ]
})

export class MediaAgenciesCmp extends ManageBase {
	constructor(title: Title, api: Sway) {
		super('getAllAdAgencies', 'Media Agencies', title, api);
	}
}
