export class User {
	constructor(
		public id: string,
		public parentId: string,
		public name: string,
		public email: string,
		public phone: string,
		public address: string,
		public status: boolean,
		public createdAt: number,
		public updatedAt: number,
		public admin: boolean,

		public adAgency?: Object,
		public talentAgency?: Object,
		public advertiser?: Object,
		public inf?: Object

	) { }
}
