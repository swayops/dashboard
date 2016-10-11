import { Component, Input, ElementRef } from '@angular/core';

import { CancelEvent } from './utils';

@Component({
	selector: 'modal',
	template: `
<div [style.max-width]="width" class="{{ class }} nosel" (keydown.escape)="hide()">
	<h2 class="heading" *ngIf="title">{{ title }}
		<a href="javascript:close()" class="fui-cross" (click)="hide()" title="Close" style="float: right"></a>
		<br>
	</h2>
	<ng-content></ng-content>
	<br>
	<div style="float: right" class="buttons">
		<button *ngFor="let btn of buttons" [class]="defaultButtonClasses + ' ' + (btn.class || 'btn-blue')"
			(click)="emitAction(btn, $event)">{{btn.text || btn.name}}</button>
	</div>
	<div class="clearfix br"></div>
</div>
`,
})

export class Modal {
	private body = document.body;
	@Input() defaultButtonClasses: string = 'btn btn-block btn-xs';
	@Input() title: string;
	@Input() width: string;
	@Input() buttons: Button[];

	private data: any;

	constructor(private eleRef: ElementRef) { }

	emitAction(btn: Button, evt?: Event) {
		this.cancelEvent(evt);

		if (!btn || !btn.click) {
			this.hide();
			return;
		}

		btn.click(new ModalEvent(this, evt, btn.name, this.data));
	}

	show(extraData: any) {
		this.data = extraData;

		const ele = this.ele;
		ele.classList.add('visible');
		this.body.classList.add('noscroll');
	}

	hide() {
		const ele = this.ele;
		ele.classList.remove('visible');

		this.body.classList.remove('noscroll');
	}

	// value returns the value of any input fields
	get value(): any {
		const out: any = {},
			eles = $('input, textarea, select', this.ele);

		eles.each(function(e) {
			const $this = $(this),
				name = $this.attr('name') || $this.attr('id');
			if (!name) return;
			if (name.indexOf('[]') !== -1) {
				out[name] = out[name] || [];
				out[name].push($this.val());
			} else {
				out[name] = $this.val();
			}
		});

		return out;
	}

	private get ele(): HTMLElement {
		return this.eleRef.nativeElement;
	}

	private cancelEvent(evt: Event) {
		if (!evt) return;
		evt.preventDefault();
		evt.stopPropagation();
	}
}


export class ModalEvent {
	constructor(public dlg: Modal, public event: Event, public name: string, public data: any) {}

	get value() { return this.dlg.value; }
	Cancel() { CancelEvent(this.event); }
}

export interface Button {
	name: string;
	class: string;
	click: (evt: ModalEvent) => void;
	text?: string; // gets set to name if this isn't set
}
