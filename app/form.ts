import { Component, Input, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { FormGroup } from '@angular/forms'

import { Sway, HasAPI } from './sway';

@Component({
	selector: 'form-ng',
	templateUrl: './views/form.html'
})

export class Form{
	@Output() data = {};
	private invalids = {};
	@Input() fields: ControlOptions[];
	private loading = false;

	constructor(api: Sway) {
	}

	save() {
		console.log(this);
		console.error('must be overriden')
	}

	validate(f: FormGroup, fld: ControlOptions) {
		const ctl = f.controls[fld.name],
			val = this.data[fld.name];
		let errors = {};
		if(ctl) console.log(ctl.errors, fld.name);

		if(!val && fld.req) {
			errors['Required'] = true;
		}

		// something is wrong with angular's regex validator so yeah this is fun
		if(fld.pattern && !fld.pattern.test(this.data[fld.name])) {
			errors[fld.error ? fld.error : 'The value doesn\'t match: ' + fld.pattern] = true;
		}

		ctl.setErrors(Object.keys(errors).length > 0 ? errors : null)
	}

	isValid(f: FormGroup, fld: ControlOptions): boolean {
		const ctl = f.controls[fld.name];
		if(!ctl) return true; // still loading
		console.log(ctl.errors)
		return !ctl.errors;
	}

	errors(f: FormGroup, fld: ControlOptions) {
		const ctl = f.controls[fld.name];
		if(!ctl || !ctl.errors) return [];
		return Object.keys(ctl.errors);
	}

	pattern(re: any): any {
		if(!re) return null;
		const s = re.toString();
		return s.substr(1, s.length - 2);
	}

	get valid(): boolean {
		return Object.keys(this.invalids).length === 0;
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
