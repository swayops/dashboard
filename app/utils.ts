import{ Pipe, PipeTransform } from '@angular/core';

export function Pad(n) {
	if(typeof n !== 'number') return '';
	if (n < 10) return '0' + n;
	return '' + n;
}

export function TsToDate(ts: number) {
	let d = new Date(ts * 1000),
		year = d.getFullYear(),
		month = Pad(1 + d.getMonth()),
		day = Pad(d.getDate());
	return year + '-' + month + '-' + day;
}

export function IsEmpty(obj: any): boolean {
	if (obj == null) return true;
	if (typeof obj === 'number') return false;
	if ('length' in obj) return obj.length === 0;
	return Object.keys(obj).length === 0;
}

@Pipe({ name: 'filter' })
export class FilterArrayPipe implements PipeTransform {
	transform(arr, fn) {
		if(!Array.isArray(arr)) return arr;
		if(typeof fn !== 'function') return console.error('must pass a function');
		return arr.filter(it => fn(it));
	}
}

export function FilterByNameOrID(kw: string, it: any): boolean {
	return kw.length === 0 || it.id.indexOf(kw) > -1 || it.name.indexOf(kw) > -1
}
