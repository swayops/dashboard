import { Component } from '@angular/core';

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

/*
type User struct {
	ID        string `json:"id"`
	ParentID  string `json:"parentId,omitempty"`
	Name      string `json:"name,omitempty"`
	Email     string `json:"email,omitempty"`
	Phone     string `json:"phone,omitempty"`
	Address   string `json:"address,omitempty"`
	Status    bool   `json:"status,omitempty"`
	CreatedAt int64  `json:"createdAt,omitempty"`
	UpdatedAt int64  `json:"updatedAt,omitempty"`
	APIKey    string `json:"apiKeys,omitempty"`
	Salt      string `json:"salt,omitempty"`
	Admin     bool   `json:"admin,omitempty"`
	//	Data      json.RawMessage `json:"Data,omitempty"`

	AdAgency     *AdAgency     `json:"adAgency,omitempty"`
	TalentAgency *TalentAgency `json:"talentAgency,omitempty"`
	Advertiser   *Advertiser   `json:"advertiser,omitempty"`
	Influencer   *Influencer   `json:"inf,omitempty"`

	//special hack, the gods will look down upon us and spit
	InfluencerLoad *InfluencerLoad `json:"influencer,omitempty"`
}
*/
