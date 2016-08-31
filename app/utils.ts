import{ Pipe, PipeTransform } from '@angular/core';

export function Pad(n) {
	if(typeof n !== 'number') return '';
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
		if(!Array.isArray(arr)) return [];
		if(typeof fn !== 'function') {
			console.error('must pass a function');
			return [];
		}
		return arr.filter(it => fn(it));
	}
}

export function FilterByNameOrID(kw: string | null, it: {id: string, name: string}): boolean {
	if(!kw || !it) return true;
	kw = kw.toLowerCase();
	if(it.id.indexOf(kw) > -1) return true;
	return it.name.toLowerCase().indexOf(kw) > -1;
}
