import { Component, EventEmitter, Input, Output, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';

import { NgForm } from '@angular/forms'

import { Sway, HasAPI } from './sway';

@Component({
	selector: 'form-dlg',
	templateUrl: './views/form.html'
})

export class FormDlg {
	@Output() onSave = new EventEmitter();

	@Input() title: string = 'Create Something'
	@Input() data: Object = {};
	@Input() fields: ControlOptions[];
	@Input() buttons = {
		cancel: 'Back',
		save: 'Save »'
	};

	private showDialog = false;
	private loading = false;
	private binders = {};

	constructor(private _loc: Location, private _ref: ElementRef) {}

	save(f: NgForm) {
		this.loading = true;
		this.onSave.emit({data: this.data, done: () => this.hide()});
	}

	hide() { this.show(false); this.loading = false; }

	show(v = true) {
		const ele = this._ref.nativeElement;
		if(!ele) return console.error('something is wrong');
		ele.classList[v ? 'add' : 'remove']('visible');
		this.showDialog = v;
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

