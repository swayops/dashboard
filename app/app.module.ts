import { enableProdMode, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent, NotFoundCmp } from './app';
import { AuthGuard, Sway } from './sway';

import { AssignGameCmp } from './assignGame';
import { CheckPayoutsCmp } from './checkPayouts';
import { ContentFeedCmp } from './contentFeed';
import { CreateCampaignCmp } from './createCampaign';
import { DashboardCmp } from './dashboard';
import { EditProfileCmp } from './editProfile';
import { ForgotPasswordCmp } from './forgotPassword';
import { LoginCmp } from './login';
import { AdvertisersCmp } from './mAdvertisers';
import { MediaAgenciesCmp } from './mAgencies';
import { ManageBillingCmp } from './mBilling';
import { CampaignsCmp } from './mCampaigns';
import { CampaignPerksCmp, OutboundPerksCmp } from './mPerks';
import { SubUsersCmp } from './mSubUsers';
import { TalentAgenciesCmp } from './mTalentAgencies';
import { TalentsCmp } from './mTalents';
import { FooterCmp, HeaderCmp, LeftNavCmp } from './nav';
import { ReportingCmp } from './reporting';
import { ResetPasswordCmp } from './resetPassword';
import { ShippingPerksCmp } from './shippingPerks';
import { SignUpCmp } from './signup';

import { FormDlg } from './form';
import { Modal } from './modal';

import { CheckCmp, FilterArrayPipe, FormatNumberPipe, TruncatePipe } from './utils';

import { ImageCropperModule } from 'ng2-img-cropper';

declare var PRODUCTION: boolean;

if (PRODUCTION) {
	enableProdMode();
}

export const ALL_ROUTES = [
	{
		path: '',
		redirectTo: '/dashboard',
		pathMatch: 'full',
	},
	{
		path: 'dashboard',
		component: DashboardCmp,
		canActivate: [AuthGuard],
	},
	{
		path: 'mAgencies',
		component: MediaAgenciesCmp,
		canActivate: [AuthGuard],
	},
	{
		path: 'mAdvertisers/:id',
		component: AdvertisersCmp,
		canActivate: [AuthGuard],
	},
	{
		path: 'mSubUsers/:id',
		component: SubUsersCmp,
		canActivate: [AuthGuard],
	},
	{
		path: 'editProfile/:id',
		component: EditProfileCmp,
		canActivate: [AuthGuard],
	},
	{
		path: 'contentFeed/:id',
		component: ContentFeedCmp,
		canActivate: [AuthGuard],
	},
	{
		path: 'mCampaigns/:id',
		component: CampaignsCmp,
		canActivate: [AuthGuard],
	},
	{
		path: 'createCampaign/:id',
		component: CreateCampaignCmp,
		canActivate: [AuthGuard],
	},
	{
		path: 'editCampaign/:id/:cid',
		component: CreateCampaignCmp,
		canActivate: [AuthGuard],
	},
	{
		path: 'createCampaign/:id/:cid',
		component: CreateCampaignCmp,
		canActivate: [AuthGuard],
	},
	{
		path: 'shippingPerks/:id',
		component: ShippingPerksCmp,
		canActivate: [AuthGuard],
	},
	{
		path: 'mCampaignPerks',
		component: CampaignPerksCmp,
		canActivate: [AuthGuard],
	},
	{
		path: 'mOutboundPerks',
		component: OutboundPerksCmp,
		canActivate: [AuthGuard],
	},
	{
		path: 'assignGame',
		component: AssignGameCmp,
		canActivate: [AuthGuard],
	},
	{
		path: 'reporting/:id',
		component: ReportingCmp,
		canActivate: [AuthGuard],
	},
	{
		path: 'mBilling/:id',
		component: ManageBillingCmp,
		canActivate: [AuthGuard],
	},
	{
		path: 'mTalentAgencies',
		component: TalentAgenciesCmp,
		canActivate: [AuthGuard],
	},
	{
		path: 'mTalents/:id',
		component: TalentsCmp,
		canActivate: [AuthGuard],
	},
	{
		path: 'checkPayouts',
		component: CheckPayoutsCmp,
		canActivate: [AuthGuard],
	},
	{
		path: 'login',
		component: LoginCmp,
	},
	{
		path: 'signup',
		component: SignUpCmp,
	},
	{
		path: 'resetPassword/:token',
		component: ResetPasswordCmp,
	},
	{
		path: 'forgotPassword',
		component: ForgotPasswordCmp,
	},
	{
		path: 'resetPassword/:uuid',
		component: ForgotPasswordCmp,
	},
	{
		path: '**',
		component: NotFoundCmp,
	},
];

@NgModule({
	declarations: [
		AppComponent, // app

		DashboardCmp,
		MediaAgenciesCmp,
		AdvertisersCmp,
		SubUsersCmp,
		EditProfileCmp,
		ContentFeedCmp,
		CampaignsCmp,
		CreateCampaignCmp,
		ShippingPerksCmp,
		CampaignPerksCmp,
		OutboundPerksCmp,
		AssignGameCmp,
		ReportingCmp,
		TalentAgenciesCmp,
		TalentsCmp,
		CheckPayoutsCmp,
		LoginCmp,
		SignUpCmp,
		ResetPasswordCmp,
		ForgotPasswordCmp,
		ManageBillingCmp,
		NotFoundCmp,

		HeaderCmp, FooterCmp, LeftNavCmp,

		FormDlg,
		Modal,

		// pipes and utils
		FilterArrayPipe, FormatNumberPipe, TruncatePipe,

		CheckCmp,
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot(ALL_ROUTES),
		FormsModule,
		HttpModule,
		ImageCropperModule,
	],
	providers: [
		Title,
		Sway,
		AuthGuard,
	],
	bootstrap: [AppComponent],
})
export class AppModule { }
