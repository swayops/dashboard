import { Component, ElementRef, Input } from '@angular/core';

@Component({
	selector: 'loader',
	template: `
	<div class="spinner" [style.width]=size [style.height]=size></div>
`,
	styles: [
		`
.spinner {
	border: 16px solid #f3f3f3; /* Light grey */
	border-top: 16px solid #3498db; /* Blue */
	border-radius: 50%;
	margin: 0 auto;
	animation: spin 2s linear infinite;
}
`,
		`
@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}`],
})
export class Loader {
	@Input() public size: string = '100px';
	public loading: boolean;
}
