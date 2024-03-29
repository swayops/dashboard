// copied from https://github.com/JohannesHoppe/angular-date-value-accessor/ because their npm package didn't work

import { Directive, ElementRef, forwardRef, HostListener, Renderer } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const DATE_VALUE_ACCESSOR: any = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => DateValueAccessor),
	multi: true,
};

/**
 * The accessor for writing a value and listening to changes on a date input element
 *
 *  ### Example
 *  `<input type="date" name="myBirthday" ngModel useValueAsDate>`
 */
@Directive({
	// this selector changes the previous behavior silently and might break existing code
	// selector: 'input[type=date][formControlName],input[type=date][formControl],input[type=date][ngModel]',

	// this selector is an opt-in version
	selector: '[useValueAsDate]',
	providers: [DATE_VALUE_ACCESSOR],
})
export class DateValueAccessor implements ControlValueAccessor {
	@HostListener('input', ['$event.target.valueAsDate']) onChange = (_: any) => { };
	@HostListener('blur', []) onTouched = () => { };

	constructor(private _renderer: Renderer, private _elementRef: ElementRef) { }

	writeValue(value: any): void {
		if (!value) {
			this._renderer.setElementProperty(this._elementRef.nativeElement, 'value', null);
			return;
		}
		if (typeof value === 'number') {
			if (value < 1e12) {
				value = value * 1000; // value is a unix ts
			}
			value = new Date(value);
		}
		this._renderer.setElementProperty(this._elementRef.nativeElement, 'valueAsDate', value);
	}

	registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
	registerOnTouched(fn: () => void): void { this.onTouched = fn; }

	setDisabledState(isDisabled: boolean): void {
		this._renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
	}
}
