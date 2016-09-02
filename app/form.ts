import { Component, Input, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { NgForm } from '@angular/forms'

import { Sway, HasAPI } from './sway';

@Component({
	selector: 'form-ng',
	templateUrl: './views/form.html'
})

export class Form {
	@Input() data: Object = {};
	@Input() fields: ControlOptions[];
	@Input() onSave: (data: Object, done: () => void) => void = (data, done) => { console.log(data); done(); };
	@Input() onCancel: () => void = () => history.back();
	@Input() buttons = {
		cancel: 'Back',
		save: 'Save »'
	};

	private loading = false;
	private binders = {};
	constructor() {}

	save(f: NgForm) {
		if(!this.onSave) {
			console.error('must provide onSave');
			return
		}
		this.loading = true;
		this.onSave(this.data, () => this.loading = false);
	}

	bind(fld: ControlOptions): Binder {
		if(!this.binders[fld.name]) {
			this.binders[fld.name] = new Binder(this.data, fld);
		}
		return this.binders[fld.name];
	}

	validate(f: NgForm, fld: ControlOptions) {
		const ctl = f.form.controls[fld.name],
			val = this.data[fld.name];
		let errors = {};

		if(!val && fld.req) {
			errors['Required'] = true;
		} else if(fld.pattern && val && !fld.pattern.test(val)) {
			// something is wrong with angular's regex validator so yeah this is fun
			errors[fld.error ? fld.error : 'The value doesn\'t match: ' + fld.pattern] = true;
		} else if(fld.sameAs && val !== this.data[fld.sameAs]) {
			errors[fld.error ? fld.error : 'Value mismatch'] = true;
		}

		fld.valid = Object.keys(errors).length === 0
		ctl.setErrors(fld.valid ? null : errors)
	}

	get valid(): boolean {
		if(this.loading) {
			return false;
		}
		return this.fields.filter(v => v.req && v.valid).length === 0
	}

	errors(f: NgForm, fld: ControlOptions) {
		const ctl = f.form.controls[fld.name];
		if(!ctl || !ctl.errors) return [];
		return Object.keys(ctl.errors);
	}
}


export interface ControlOptions {
	title: string;
	name: string;
	placeholder?: string // defaults to title

	req?: boolean;
	pattern?: RegExp;

	error?: string; // error message displayed

	sameAs?: string; // for verify email/password fields

	input?: string;
	textarea?: boolean;
	checkbox?: boolean;

	valid?: boolean;
}

class Binder {
	private name: string;
	constructor(private data: Object, private fld: ControlOptions) {
		let parts = fld.name.split('.'),
			lastKey = parts[parts.length - 1];
		for(let i = 0; i < parts.length - 1; i++) {
			const k = parts[i];
			data = (data[k] = data[k] || {});
		}
		this.data = data;
		this.name = lastKey;
	}

	set value(val: any) {
		if(this.fld.input === 'number') val = parseFloat(val);
		this.data[this.name] = val;
	}
	get value(): any { return this.data[this.name]; }
}
