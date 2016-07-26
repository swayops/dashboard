export function Pad(n) {
	if(n < 10) {
		return '0' + n;
	}
	return n.toString();
}

export function	TsToDate(ts: number) {
	let d = new Date(ts * 1000),
		year = d.getFullYear(),
		month = Pad(1 + d.getMonth()),
		day = Pad(d.getDate());
	return year + '-' + month + '-' + day;
}
