import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Title, BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { AppComponent, NotFoundCmp } from './app';
import { AuthGuard, Sway } from './sway';

import { LoginCmp } from './login';
import { SignUpCmp } from './signup';
import { ForgotPasswordCmp } from './forgotPassword';

import { DashboardCmp } from './dashboard';
import { MediaAgenciesCmp } from './mAgencies';
import { AdvertisersCmp } from './mAdvertisers';
import { EditProfileCmp } from './editProfile';
import { ContentFeedCmp } from './contentFeed';
import { CampaignsCmp } from './mCampaigns';
import { CreateCampaignCmp } from './createCampaign';
import { OutboundPerksCmp, CampaignPerksCmp } from './mPerks';
import { ReportingCmp } from './reporting';
import { TalentAgenciesCmp } from './mTalentAgencies';
import { TalentsCmp } from './mTalents';
import { CheckPayoutsCmp } from './checkPayouts';
import { ResetPasswordCmp } from './resetPassword';

import { HeaderCmp, FooterCmp, LeftNavCmp } from './nav';

import { FormDlg } from './form';
import { Modal } from './modal';

import { FilterArrayPipe } from './utils';

import { ImageCropperComponent } from 'ng2-img-cropper';

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
		path: 'reporting/:id',
		component: ReportingCmp,
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
	// {
	// 	path: 'signup',
	// 	component: SignUpCmp,
	// },
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

		FormDlg,
		Modal,

		// pipes and utils
		FilterArrayPipe,

		ImageCropperComponent,
	].concat(ALL_ROUTES.map(v => (<any> v).component).filter(v => !!v)),
	imports: [
		BrowserModule,
		RouterModule.forRoot(ALL_ROUTES),
		FormsModule,
		HttpModule,
	],
	providers: [
		Title,
		Sway,
		AuthGuard,
	],
	bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
