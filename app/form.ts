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

	@Input() title: string;
	@Input() fields: ControlOptions[];
	@Input() buttons = {
		cancel: 'Back',
		save: 'Save »',
		loading: 'Loading...'
	};

	private data: Object = {};
	private realTitle: string;
	private showDialog = false;
	private loading = false;
	private invalids = {};
	private binders = {};

	constructor(private _loc: Location, private _ref: ElementRef) {}

	save(f: NgForm) {
		this.loading = true;
		this.onSave.emit({data: this.data, done: () => this.hide()});
	}

	hide() {
		this.setVisible(false);
		this.loading = false;
	}

	show(data: Object, title = this.title) {
		this.data = data;
		this.realTitle = title;
		this.setVisible(true);
	}

	bind(fld: ControlOptions): Binder {
		if(!this.binders[fld.name]) {
			this.binders[fld.name] = new Binder(this.data, fld);
		}
		return this.binders[fld.name];
	}

	// this shouldn't be like this but there's something wrong with dynamic form generation
	validate(f: NgForm, fld: ControlOptions) {
		const ctl = f.form.controls[fld.name],
			errors = this.binders[fld.name].errors;

		if(Object.keys(errors).length > 0) {
			ctl.setErrors(errors);
		} else {
			ctl.setErrors(null);
		}
	}

	get valid(): boolean {
		if(this.loading) return false;

		let hasErrors = false;
		Object.keys(this.binders).forEach(k => {
			if(hasErrors) return;
			const v = this.binders[k];
			hasErrors = Object.keys(v.errors).length > 0
		});
		return !hasErrors;
	}

	errors(f: NgForm, fld: ControlOptions) {
		const ctl = f.form.controls[fld.name];
		if(!ctl || !ctl.errors) return [];
		return Object.keys(ctl.errors);
	}

	private setVisible(v: boolean) {
		const ele = this._ref.nativeElement;
		if(!ele) return console.error('something is wrong');
		ele.classList[v ? 'add' : 'remove']('visible');
		this.showDialog = v;
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

	get errors(): {} {
		const val = this.value,
			fld = this.fld,
			errors = {};

		if(!val && fld.req) {
			errors['Required'] = true;
		} else if(fld.pattern && val && !fld.pattern.test(val)) {
			// something is wrong with angular's regex validator so yeah this is fun
			errors[fld.error ? fld.error : 'The value doesn\'t match: ' + fld.pattern] = true;
		} else if(fld.sameAs && val !== this.data[fld.sameAs]) {
			errors[fld.error ? fld.error : 'Value mismatch'] = true;
		}
		return errors;
	}
}

