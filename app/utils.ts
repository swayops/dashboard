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
	};
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

export function CancelEvent(evt: Event) {
	if (!evt) return;
	evt.stopPropagation();
	evt.preventDefault();
}
// used https://github.com/substack/provinces/blob/master/provinces.json for state names

export const CountriesAndStates = [
	{id: 'ad', text: 'Andorra'},
	{id: 'ae', text: 'United Arab Emirates'},
	{id: 'af', text: 'Afghanistan'},
	{id: 'ag', text: 'Antigua And Barbuda'},
	{id: 'ai', text: 'Anguilla'},
	{id: 'al', text: 'Albania'},
	{id: 'am', text: 'Armenia'},
	{id: 'ao', text: 'Angola'},
	{id: 'aq', text: 'Antarctica'},
	{id: 'ar', text: 'Argentina'},
	{id: 'as', text: 'American Samoa'},
	{id: 'at', text: 'Austria'},
	{id: 'au', text: 'Australia'},
	{id: 'aw', text: 'Aruba'},
	{id: 'ax', text: 'Aland Islands'},
	{id: 'az', text: 'Azerbaijan'},
	{id: 'ba', text: 'Bosnia And Herzegovina'},
	{id: 'bb', text: 'Barbados'},
	{id: 'bd', text: 'Bangladesh'},
	{id: 'be', text: 'Belgium'},
	{id: 'bf', text: 'Burkina Faso'},
	{id: 'bg', text: 'Bulgaria'},
	{id: 'bh', text: 'Bahrain'},
	{id: 'bi', text: 'Burundi'},
	{id: 'bj', text: 'Benin'},
	{id: 'bl', text: 'Saint-Barthelemy'},
	{id: 'bm', text: 'Bermuda'},
	{id: 'bn', text: 'Brunei Darussalam'},
	{id: 'bo', text: 'Bolivia, Plurinational State Of'},
	{id: 'bq', text: 'Bonaire, Sint Eustatius And Saba'},
	{id: 'br', text: 'Brazil'},
	{id: 'bs', text: 'Bahamas'},
	{id: 'bt', text: 'Bhutan'},
	{id: 'bv', text: 'Bouvet Island'},
	{id: 'bw', text: 'Botswana'},
	{id: 'by', text: 'Belarus'},
	{id: 'bz', text: 'Belize'},
	{id: 'ca', text: 'Canada'},
	{id: 'ca-ab', text: 'Alberta (CA)'},
	{id: 'ca-bc', text: 'British Columbia (CA)'},
	{id: 'ca-mb', text: 'Manitoba (CA)'},
	{id: 'ca-nb', text: 'New Brunswick (CA)'},
	{id: 'ca-nl', text: 'Newfoundland and Labrador (CA)'},
	{id: 'ca-ns', text: 'Nova Scotia (CA)'},
	{id: 'ca-nu', text: 'Nunavut (CA)'},
	{id: 'ca-nt', text: 'Northwest Territories (CA)'},
	{id: 'ca-on', text: 'Ontario (CA)'},
	{id: 'ca-pe', text: 'Prince Edward Island (CA)'},
	{id: 'ca-qc', text: 'Quebec (CA)'},
	{id: 'ca-sk', text: 'Saskatchewan (CA)'},
	{id: 'ca-yt', text: 'Yukon (CA)'},
	{id: 'cc', text: 'Cocos (Keeling) Islands'},
	{id: 'cd', text: 'Congo, The Democratic Republic Of The'},
	{id: 'cf', text: 'Central African Republic'},
	{id: 'cg', text: 'Congo'},
	{id: 'ch', text: 'Switzerland'},
	{id: 'ci', text: 'Cote Divoire'},
	{id: 'ck', text: 'Cook Islands'},
	{id: 'cl', text: 'Chile'},
	{id: 'cm', text: 'Cameroon'},
	{id: 'cn', text: 'China'},
	{id: 'co', text: 'Colombia'},
	{id: 'cr', text: 'Costa Rica'},
	{id: 'cu', text: 'Cuba'},
	{id: 'cv', text: 'Cape Verde'},
	{id: 'cw', text: 'Curacao'},
	{id: 'cx', text: 'Christmas Island'},
	{id: 'cy', text: 'Cyprus'},
	{id: 'cz', text: 'Czech Republic'},
	{id: 'de', text: 'Germany'},
	{id: 'dj', text: 'Djibouti'},
	{id: 'dk', text: 'Denmark'},
	{id: 'dm', text: 'Dominica'},
	{id: 'do', text: 'Dominican Republic'},
	{id: 'dz', text: 'Algeria'},
	{id: 'ec', text: 'Ecuador'},
	{id: 'ee', text: 'Estonia'},
	{id: 'eg', text: 'Egypt'},
	{id: 'eh', text: 'Western Sahara'},
	{id: 'er', text: 'Eritrea'},
	{id: 'es', text: 'Spain'},
	{id: 'et', text: 'Ethiopia'},
	{id: 'fi', text: 'Finland'},
	{id: 'fj', text: 'Fiji'},
	{id: 'fk', text: 'Falkland Islands (Malvinas)'},
	{id: 'fm', text: 'Micronesia, Federated States Of'},
	{id: 'fo', text: 'Faroe Islands'},
	{id: 'fr', text: 'France'},
	{id: 'ga', text: 'Gabon'},
	{id: 'gb', text: 'United Kingdom'},
	{id: 'gd', text: 'Grenada'},
	{id: 'ge', text: 'Georgia'},
	{id: 'gf', text: 'French Guiana'},
	{id: 'gg', text: 'Guernsey'},
	{id: 'gh', text: 'Ghana'},
	{id: 'gi', text: 'Gibraltar'},
	{id: 'gl', text: 'Greenland'},
	{id: 'gm', text: 'Gambia'},
	{id: 'gn', text: 'Guinea'},
	{id: 'gp', text: 'Guadeloupe'},
	{id: 'gq', text: 'Equatorial Guinea'},
	{id: 'gr', text: 'Greece'},
	{id: 'gs', text: 'South Georgia And The South Sandwich Islands'},
	{id: 'gt', text: 'Guatemala'},
	{id: 'gu', text: 'Guam'},
	{id: 'gw', text: 'Guinea-Bissau'},
	{id: 'gy', text: 'Guyana'},
	{id: 'hk', text: 'Hong Kong'},
	{id: 'hm', text: 'Heard Island And Mcdonald Islands'},
	{id: 'hn', text: 'Honduras'},
	{id: 'hr', text: 'Croatia'},
	{id: 'ht', text: 'Haiti'},
	{id: 'hu', text: 'Hungary'},
	{id: 'id', text: 'Indonesia'},
	{id: 'ie', text: 'Ireland'},
	{id: 'il', text: 'Israel'},
	{id: 'im', text: 'Isle Of Man'},
	{id: 'in', text: 'India'},
	{id: 'io', text: 'British Indian Ocean Territory'},
	{id: 'iq', text: 'Iraq'},
	{id: 'ir', text: 'Iran, Islamic Republic Of'},
	{id: 'is', text: 'Iceland'},
	{id: 'it', text: 'Italy'},
	{id: 'je', text: 'Jersey'},
	{id: 'jm', text: 'Jamaica'},
	{id: 'jo', text: 'Jordan'},
	{id: 'jp', text: 'Japan'},
	{id: 'ke', text: 'Kenya'},
	{id: 'kg', text: 'Kyrgyzstan'},
	{id: 'kh', text: 'Cambodia'},
	{id: 'ki', text: 'Kiribati'},
	{id: 'km', text: 'Comoros'},
	{id: 'kn', text: 'Saint Kitts And Nevis'},
	{id: 'kp', text: 'Korea'},
	{id: 'kr', text: 'Korea, Republic Of'},
	{id: 'kw', text: 'Kuwait'},
	{id: 'ky', text: 'Cayman Islands'},
	{id: 'kz', text: 'Kazakhstan'},
	{id: 'la', text: 'Lao Peoples Democratic Republic'},
	{id: 'lb', text: 'Lebanon'},
	{id: 'lc', text: 'Saint Lucia'},
	{id: 'li', text: 'Liechtenstein'},
	{id: 'lk', text: 'Sri Lanka'},
	{id: 'lr', text: 'Liberia'},
	{id: 'ls', text: 'Lesotho'},
	{id: 'lt', text: 'Lithuania'},
	{id: 'lu', text: 'Luxembourg'},
	{id: 'lv', text: 'Latvia'},
	{id: 'ly', text: 'Libya'},
	{id: 'ma', text: 'Morocco'},
	{id: 'mc', text: 'Monaco'},
	{id: 'md', text: 'Moldova, Republic Of'},
	{id: 'me', text: 'Montenegro'},
	{id: 'mf', text: 'Saint Martin (French Part)'},
	{id: 'mg', text: 'Madagascar'},
	{id: 'mh', text: 'Marshall Islands'},
	{id: 'mk', text: 'Macedonia, The Former Yugoslav Republic Of'},
	{id: 'ml', text: 'Mali'},
	{id: 'mm', text: 'Myanmar'},
	{id: 'mn', text: 'Mongolia'},
	{id: 'mo', text: 'Macao'},
	{id: 'mp', text: 'Northern Mariana Islands'},
	{id: 'mq', text: 'Martinique'},
	{id: 'mr', text: 'Mauritania'},
	{id: 'ms', text: 'Montserrat'},
	{id: 'mt', text: 'Malta'},
	{id: 'mu', text: 'Mauritius'},
	{id: 'mv', text: 'Maldives'},
	{id: 'mw', text: 'Malawi'},
	{id: 'mx', text: 'Mexico'},
	{id: 'my', text: 'Malaysia'},
	{id: 'mz', text: 'Mozambique'},
	{id: 'na', text: 'Namibia'},
	{id: 'nc', text: 'New Caledonia'},
	{id: 'ne', text: 'Niger'},
	{id: 'nf', text: 'Norfolk Island'},
	{id: 'ng', text: 'Nigeria'},
	{id: 'ni', text: 'Nicaragua'},
	{id: 'nl', text: 'Netherlands'},
	{id: 'no', text: 'Norway'},
	{id: 'np', text: 'Nepal'},
	{id: 'nr', text: 'Nauru'},
	{id: 'nu', text: 'Niue'},
	{id: 'nz', text: 'New Zealand'},
	{id: 'om', text: 'Oman'},
	{id: 'pa', text: 'Panama'},
	{id: 'pe', text: 'Peru'},
	{id: 'pf', text: 'French Polynesia'},
	{id: 'pg', text: 'Papua New Guinea'},
	{id: 'ph', text: 'Philippines'},
	{id: 'pk', text: 'Pakistan'},
	{id: 'pl', text: 'Poland'},
	{id: 'pm', text: 'Saint Pierre And Miquelon'},
	{id: 'pn', text: 'Pitcairn'},
	{id: 'pr', text: 'Puerto Rico'},
	{id: 'ps', text: 'Palestine, State Of'},
	{id: 'pt', text: 'Portugal'},
	{id: 'pw', text: 'Palau'},
	{id: 'py', text: 'Paraguay'},
	{id: 'qa', text: 'Qatar'},
	{id: 're', text: 'Reunion'},
	{id: 'ro', text: 'Romania'},
	{id: 'rs', text: 'Serbia'},
	{id: 'ru', text: 'Russian Federation'},
	{id: 'rw', text: 'Rwanda'},
	{id: 'sa', text: 'Saudi Arabia'},
	{id: 'sb', text: 'Solomon Islands'},
	{id: 'sc', text: 'Seychelles'},
	{id: 'sd', text: 'Sudan'},
	{id: 'se', text: 'Sweden'},
	{id: 'sg', text: 'Singapore'},
	{id: 'sh', text: 'Saint Helena, Ascension And Tristan Da Cunha'},
	{id: 'si', text: 'Slovenia'},
	{id: 'sj', text: 'Svalbard And Jan Mayen'},
	{id: 'sk', text: 'Slovakia'},
	{id: 'sl', text: 'Sierra Leone'},
	{id: 'sm', text: 'San Marino'},
	{id: 'sn', text: 'Senegal'},
	{id: 'so', text: 'Somalia'},
	{id: 'sr', text: 'Suriname'},
	{id: 'ss', text: 'South Sudan'},
	{id: 'st', text: 'Sao Tome And Principe'},
	{id: 'sv', text: 'El Salvador'},
	{id: 'sx', text: 'Sint Maarten (Dutch Part)'},
	{id: 'sy', text: 'Syrian Arab Republic'},
	{id: 'sz', text: 'Swaziland'},
	{id: 'tc', text: 'Turks And Caicos Islands'},
	{id: 'td', text: 'Chad'},
	{id: 'tf', text: 'French Southern Territories'},
	{id: 'tg', text: 'Togo'},
	{id: 'th', text: 'Thailand'},
	{id: 'tj', text: 'Tajikistan'},
	{id: 'tk', text: 'Tokelau'},
	{id: 'tl', text: 'Timor-Leste'},
	{id: 'tm', text: 'Turkmenistan'},
	{id: 'tn', text: 'Tunisia'},
	{id: 'to', text: 'Tonga'},
	{id: 'tr', text: 'Turkey'},
	{id: 'tt', text: 'Trinidad And Tobago'},
	{id: 'tv', text: 'Tuvalu'},
	{id: 'tw', text: 'Taiwan, Province Of China'},
	{id: 'tz', text: 'Tanzania, United Republic Of'},
	{id: 'ua', text: 'Ukraine'},
	{id: 'ug', text: 'Uganda'},
	{id: 'um', text: 'United States Minor Outlying Islands'},
	{id: 'us', text: 'United States'},
	{id: 'us-al', text: 'Alabama (US)'},
	{id: 'us-ak', text: 'Alaska (US)'},
	{id: 'us-as', text: 'American Samoa (US)'},
	{id: 'us-az', text: 'Arizona (US)'},
	{id: 'us-ar', text: 'Arkansas (US)'},
	{id: 'us-ca', text: 'California (US)'},
	{id: 'us-co', text: 'Colorado (US)'},
	{id: 'us-ct', text: 'Connecticut (US)'},
	{id: 'us-de', text: 'Delaware (US)'},
	{id: 'us-dc', text: 'District Of Columbia (US)'},
	{id: 'us-fm', text: 'Federated States Of Micronesia (US)'},
	{id: 'us-fl', text: 'Florida (US)'},
	{id: 'us-ga', text: 'Georgia (US)'},
	{id: 'us-gu', text: 'Guam (US)'},
	{id: 'us-hi', text: 'Hawaii (US)'},
	{id: 'us-id', text: 'Idaho (US)'},
	{id: 'us-il', text: 'Illinois (US)'},
	{id: 'us-in', text: 'Indiana (US)'},
	{id: 'us-ia', text: 'Iowa (US)'},
	{id: 'us-ks', text: 'Kansas (US)'},
	{id: 'us-ky', text: 'Kentucky (US)'},
	{id: 'us-la', text: 'Louisiana (US)'},
	{id: 'us-me', text: 'Maine (US)'},
	{id: 'us-mh', text: 'Marshall Islands (US)'},
	{id: 'us-md', text: 'Maryland (US)'},
	{id: 'us-ma', text: 'Massachusetts (US)'},
	{id: 'us-mi', text: 'Michigan (US)'},
	{id: 'us-mn', text: 'Minnesota (US)'},
	{id: 'us-ms', text: 'Mississippi (US)'},
	{id: 'us-mo', text: 'Missouri (US)'},
	{id: 'us-mt', text: 'Montana (US)'},
	{id: 'us-ne', text: 'Nebraska (US)'},
	{id: 'us-nv', text: 'Nevada (US)'},
	{id: 'us-nh', text: 'New Hampshire (US)'},
	{id: 'us-nj', text: 'New Jersey (US)'},
	{id: 'us-nm', text: 'New Mexico (US)'},
	{id: 'us-ny', text: 'New York (US)'},
	{id: 'us-nc', text: 'North Carolina (US)'},
	{id: 'us-nd', text: 'North Dakota (US)'},
	{id: 'us-mp', text: 'Northern Mariana Islands (US)'},
	{id: 'us-oh', text: 'Ohio (US)'},
	{id: 'us-ok', text: 'Oklahoma (US)'},
	{id: 'us-or', text: 'Oregon (US)'},
	{id: 'us-pw', text: 'Palau (US)'},
	{id: 'us-pa', text: 'Pennsylvania (US)'},
	{id: 'us-pr', text: 'Puerto Rico (US)'},
	{id: 'us-ri', text: 'Rhode Island (US)'},
	{id: 'us-sc', text: 'South Carolina (US)'},
	{id: 'us-sd', text: 'South Dakota (US)'},
	{id: 'us-tn', text: 'Tennessee (US)'},
	{id: 'us-tx', text: 'Texas (US)'},
	{id: 'us-ut', text: 'Utah (US)'},
	{id: 'us-vt', text: 'Vermont (US)'},
	{id: 'us-vi', text: 'Virgin Islands (US)'},
	{id: 'us-va', text: 'Virginia (US)'},
	{id: 'us-wa', text: 'Washington (US)'},
	{id: 'us-wv', text: 'West Virginia (US)'},
	{id: 'us-wi', text: 'Wisconsin (US)'},
	{id: 'us-wy', text: 'Wyoming (US)'},
	{id: 'uy', text: 'Uruguay'},
	{id: 'uz', text: 'Uzbekistan'},
	{id: 'va', text: 'Holy See (Vatican City State)'},
	{id: 'vc', text: 'Saint Vincent And The Grenadines'},
	{id: 've', text: 'Venezuela, Bolivarian Republic Of'},
	{id: 'vg', text: 'Virgin Islands, British'},
	{id: 'vi', text: 'Virgin Islands, U.S.'},
	{id: 'vn', text: 'Viet Nam'},
	{id: 'vu', text: 'Vanuatu'},
	{id: 'wf', text: 'Wallis And Futuna'},
	{id: 'ws', text: 'Samoa'},
	{id: 'ye', text: 'Yemen'},
	{id: 'yt', text: 'Mayotte'},
	{id: 'za', text: 'South Africa'},
	{id: 'zm', text: 'Zambia'},
	{id: 'zw', text: 'Zimbabwe'},
];

export const CountriesAndStatesRev = (function() {
	const out = {};
	for (let v of CountriesAndStates) {
		out[v.id] = v.text;
	}
	return out;
})();
