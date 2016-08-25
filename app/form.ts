import { Component, Input, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { NgForm } from '@angular/forms'

import { Sway, HasAPI } from './sway';

@Component({
	selector: 'form-ng',
	templateUrl: './views/form.html'
})

export class Form{
	@Input() data: Object = {};
	@Input() fields: ControlOptions[];
	@Input() onSave: (data: Object, done: () => void) => void;
	@Input() onCancel: () => void;

	private loading = false;

	constructor() {}

	save(f: NgForm) {
		if(!this.onSave) {
			console.error('must provide onSave');
			return
		}
		this.loading = true;
		this.onSave(this.data, () => this.loading = false);
	}

	validate(f: NgForm, fld: ControlOptions) {
		const ctl = f.form.controls[fld.name],
			val = this.data[fld.name];
		let errors = {};

		if(!val && fld.req) {
			errors['Required'] = true;
		}

		// something is wrong with angular's regex validator so yeah this is fun
		if(fld.pattern && !fld.pattern.test(this.data[fld.name])) {
			errors[fld.error ? fld.error : 'The value doesn\'t match: ' + fld.pattern] = true;
		}

		ctl.setErrors(Object.keys(errors).length > 0 ? errors : null)
	}

	errors(f: NgForm, fld: ControlOptions) {
		const ctl = f.form.controls[fld.name];
		if(!ctl || !ctl.errors) return [];
		return Object.keys(ctl.errors);
	}
}

interface ControlOptions {
	title: string;
	name: string;
	placeholder?: string // defaults to title

	req?: boolean;
	min?: number; // implies required
	pattern?: RegExp;

	error?: string;

	input?: string;
	textarea?: boolean;
	checkbox?: boolean;
}
