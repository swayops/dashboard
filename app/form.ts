import { Component, EventEmitter, Input, Output, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';

import { NgForm } from '@angular/forms'

import { Sway, HasAPI } from './sway';

@Component({
	selector: 'smart-form',
	templateUrl: './views/form.html'
})

export class FormDlg {
	@Output() onSave = new EventEmitter();

	@Input() title: string;
	@Input() fields: ControlOption[];
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

	show(data: any) {
		this.data = data;
		this.rebind();
		this.setVisible(true);
	}

	rebind() {
		const binders = {};
		this.fields.forEach(fld => binders[fld.name] = new Binder(this.data, fld));
		this.binders = binders;
	}

	// this shouldn't be done like this but there's something wrong with dynamic form generation and binding
	set(ctl: any) { this.binders[ctl.name].value = ctl.value; }

	get valid(): boolean {
		if(this.loading) return false;

		let hasErrors = false;
		Object.keys(this.binders).forEach(k => {
			if(hasErrors) return;
			const v = this.binders[k];
			hasErrors = (v.fld.req && v.value === '') || v.errors.length > 0;
		});
		return !hasErrors;
	}

	private setVisible(v: boolean) {
		const ele = this._ref.nativeElement;
		if(!ele) return console.error('something is wrong');
		ele.classList[v ? 'add' : 'remove']('visible');
		this.showDialog = v;
	}
}

export interface ControlOption {
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
	private touched: boolean;

	constructor(private data: Object, private fld: ControlOption) {
		let parts = fld.name.split('.'),
			lastKey = parts[parts.length - 1];
		for(let i = 0; i < parts.length - 1; i++) {
			const k = parts[i];
			data = (data[k] = data[k] || {});
		}
		this.data = data;
		this.name = lastKey;
		if(!(lastKey in data)) data[lastKey] = '';
	}

	set value(val: any) {
		this.touched = true;
		if(this.fld.input === 'number') val = parseFloat(val);
		this.data[this.name] = val;
	}

	get value(): any { return this.data[this.name]; }

	get errors(): {} {
		const val = this.value,
			fld = this.fld,
			errors = [];

		if(!val && fld.req) {
			errors.push('Required');
		} else if(fld.pattern && val && !fld.pattern.test(val)) {
			// something is wrong with angular's regex validator so yeah this is fun
			errors.push(fld.error ? fld.error : 'The value doesn\'t match: ' + fld.pattern);
		} else if(fld.sameAs && val !== this.data[fld.sameAs]) {
			errors.push(fld.error ? fld.error : 'Value mismatch');
		}
		return errors;
	}
}

