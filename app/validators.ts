import {FormControl} from '@angular/forms';

function validateEmail(c: FormControl) {
		let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)/

	return EMAIL_REGEXP.test(c.value) ? null : {
		validateEmail: { valid: false }
	};
}
