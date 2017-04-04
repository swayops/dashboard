import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';
import { ModalEvent } from './modal';
import { CancelEvent } from './utils';

// TODO major clean up
@Component({
	selector: 'smart-form',
	templateUrl: './views/form.html',
})

export class FormDlg {
	@Output() onSave = new EventEmitter();

	@Input() value: {}; // setting value automatically shows the form, YMMV
	@Input() title: string;
	@Input() showManageUsers: boolean;
	@Input() fields: ControlOption[];
	@Input() saveLabel = 'Save »';
	@Input() cancelLabel = 'Back';
	@Input() loadingLabel = 'Loading...';

	public data = {};
	public showDialog = false;
	public loading = false;
	public binders: { [key: string]: Binder } = {};

	public imgButtons = [
		{ name: 'Cancel', class: 'btn-blue ghost' },
		{ name: 'Save & crop image »', class: 'btn-info', click: (evt) => this.setImage(evt) },
	];

	@ViewChild('cropper') public cropper: ImageCropperComponent;
	public cropperSettings: CropperSettings;
	public cropData: any = {};

	constructor(public eleRef: ElementRef) {
		this.cropperSettings = Object.assign(new CropperSettings(), {
			keepAspect: true,
			responsive: true,
			canvasWidth: 300,
			canvasHeight: 300,
			croppedWidth: 300,
			croppedHeight: 300,
			noFileInput: true,
			minHeight: 300,
		});
		this.cropperSettings.rounded = true;
	}

	ngOnInit() {
		if (this.value) this.show(this.value);
	}

	save(f: NgForm) {
		this.loading = true;
		this.onSave.emit({ data: this.data, done: () => this.hide() });
	}

	hide(evt?: MouseEvent) {
		CancelEvent(evt);

		this.setVisible(false);
		this.loading = false;
	}

	show(data?: any) {
		this.data = Object.assign({}, data || {});
		this.rebind();
		this.setVisible(true);
	}

	rebind() {
		const binders = {};
		this.fields.forEach((fld) => binders[fld.name] = new Binder(this.data, fld));
		this.binders = binders;
	}

	// this shouldn't be done like this but there's something wrong with dynamic form generation and binding
	updateValue(ctl: any) {
		const b = this.binders[ctl.name],
			fld = b.fld;
		if (fld.checkbox || fld.toggle) {
			b.value = ctl.checked;
			return;
		}
		if (fld.textarea || fld.input !== 'file') {
			b.value = ctl.value;
			return;
		}
		const f = ctl.files[0];
		if (!f) return;
		if (f.attrs && f.attrs.accept && !f.type.match(fld.attrs.accept)) {
			b.value = 'error';
			return;
		}
		const rd = new FileReader();
		rd.addEventListener('load', () => {
			b.value = rd.result;
		}, false);
		rd.readAsDataURL(f);
	}

	getValue(ctl: any): any {
		const b = this.binders[ctl.name];
		if (b.fld.input === 'file') return null;
		return b.value;
	}

	setAttrs(ctl: any) {
		const b = this.binders[ctl.name],
			fld = b.fld;
		if (b.touched) return;

		if (fld.input === 'number') ctl.setAttribute('step', '0.01');

		if (fld.req) {
			ctl.setAttribute('required', '');
			ctl.classList.add('req');
		}

		for (const [k, v] of Object.entries(fld.attrs || {})) {
			ctl.setAttribute(k, v);
		}
	}

	setCheckbox(chk: HTMLInputElement) {
		if (!chk || chk.tagName !== 'INPUT' || !chk.name) return;
		chk.checked = !chk.checked;
		this.updateValue(chk);
	}

	loadImage(e: any) {
		CancelEvent(e);

		const image = new Image(),
			file = (e.target.files || e.dataTransfer.files)[0],
			rd = new FileReader(),
			cropper = this.cropper;

		rd.onloadend = (evt: any) => {
			image.src = evt.target.result;
			cropper.setImage(image);
		};

		rd.readAsDataURL(file);
	}

	setImage(evt: ModalEvent) {
		evt.Cancel();
		evt.dlg.hide();
		this.data[evt.data.name] = this.cropData.image;
	}

	get valid(): boolean {
		if (this.loading) return false;

		let hasErrors = false;
		Object.keys(this.binders).forEach((k) => {
			if (hasErrors) return;
			const v = this.binders[k];
			hasErrors = (v.fld.req && v.value === '') || v.error != null;
		});
		return !hasErrors;
	}

	public setVisible(v: boolean) {
		const ele = this.eleRef.nativeElement;
		if (!ele) return console.error('something is wrong');
		ele.classList[v ? 'add' : 'remove']('visible');
		this.showDialog = v;
	}
}

export interface ControlOption {
	title: string;
	name: string;
	placeholder?: string; // defaults to title

	req?: boolean;
	pattern?: RegExp;

	error?: string; // error message displayed

	sameAs?: string; // for verify email/password fields

	input?: string;
	textarea?: boolean;
	checkbox?: boolean;
	toggle?: boolean;
	image?: {
		opts: any,
	};

	attrs?: any;

	validate?: (v: any) => any;
}

class Binder {
	public name: string;
	public touched: boolean;

	constructor(public data: {}, public fld: ControlOption) {
		const parts = fld.name.split('.'),
			lastKey = parts[parts.length - 1];
		for (let i = 0; i < parts.length - 1; i++) {
			const k = parts[i];
			data = (data[k] = data[k] || {});
		}
		this.data = data;
		this.name = lastKey;
		if (!(lastKey in data)) data[lastKey] = null;
	}

	set value(val: any) {
		this.touched = true;
		if (this.fld.input === 'number') val = parseFloat(val);
		this.data[this.name] = val;
	}

	get value(): any { return this.data[this.name]; }

	get error(): string | null {
		const val = this.value,
			fld = this.fld;

		if (!val && fld.req) {
			return 'Required';
		} else if (fld.pattern && val && !fld.pattern.test(val)) {
			// something is wrong with angular's regex validator so yeah this is fun
			return fld.error ? fld.error : 'The value doesn\'t match: ' + fld.pattern;
		} else if (fld.sameAs && val !== this.data[fld.sameAs]) {
			return fld.error ? fld.error : 'Value mismatch';
		} else if (fld.input === 'file' && val === 'error') {
			return fld.error ? fld.error : 'Invalid image type';
		} else if (fld.validate) {
			return fld.validate(val);
		}

		return null;
	}
}
