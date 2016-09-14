import { Pipe, PipeTransform } from '@angular/core';

export function Pad(n) {
	if (typeof n !== 'number') return '';
	if (n < 10) return '0' + n;
	return '' + n;
}

export function IsEmpty(obj: any): boolean {
	if (obj == null) return true;
	if (typeof obj === 'number') return false;
	return Object.keys(obj).length === 0;
}

@Pipe({ name: 'filter' })
export class FilterArrayPipe implements PipeTransform {
	transform(arr, fn): any[] {
		if (!Array.isArray(arr)) return [];
		if (typeof fn !== 'function') {
			console.error('must pass a function');
			return [];
		}
		return arr.filter(fn);
	}
}

export function FilterByProps(kw: string | null, it: Object, ...props: string[]): boolean {
	if (!kw || !it) return true;
	kw = kw.toLowerCase();
	return props.some(k => {
		const v = it[k];
		if (!v) return false;
		return v.toLowerCase().indexOf(kw) > -1;
	});
}

export function SortBy(...props: string[]): (a, b) => number {
	return (a, b): number => {
		let ret = 0;
		props.some(k => {
			let sortOrder = 1;
			if (k[0] === '-') {
				sortOrder = -1;
				k = k.substr(1);
			}
			const av = a[k], bv = b[k];
			if (av == null || av < bv) {
				ret = -1 * sortOrder;
			} else if (bv == null || av > bv) {
				ret = 1 * sortOrder;
			}
			return ret !== 0;
		});
		return ret;
	}
}

export function Throttle(callback: (...args: any[]) => any, thisArg: Object, limit: number = 100) {
	let wait = false;
	return function () {
		if (wait) return;
		wait = true;
		setTimeout(() => wait = false, limit);
		return Reflect.apply(callback, thisArg, arguments);
	};
}

