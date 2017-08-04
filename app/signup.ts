import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { LoadScript, Sway } from './sway';

@Component({
	selector: 'signup',
	templateUrl: './views/signup.html',
})
export class SignUpCmp implements OnInit {
	public form: any = { name: '', email: '', pass: '', advertiser: { dspFee: 0.2, exchangeFee: 0.2 } };
	public loading = false;
	public error: any;

	constructor(title: Title, public api: Sway) {
		title.setTitle('Sway :: Sign Up');
		this.api.Logout(false);
	}

	ngOnInit() {
		// <!--Start of HubSpot Embed Code -- >
		LoadScript('//js.hs-scripts.com/3428400.js', {
			id: 'hs-script-loader',
		});
		// < script type= "text/javascript" id= "hs-script-loader" async defer src= "//js.hs-scripts.com/3428400.js" > </script>
		// < !--End of HubSpot Embed Code -- >
	}

	SignUp() {
		this.loading = true;
		this.api.SignUpAdvertiser(this.form, (err) => {
			this.error = err.msg;
			this.loading = false;
		}, true);
	}
}
