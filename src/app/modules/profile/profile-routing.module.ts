import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProfileComponent } from "@modules/profile/profile.component";
import { UserInformationComponent } from "@modules/profile/pages/user-information/user-information.component";
import { UserAvatarComponent } from "@modules/profile/pages/user-avatar/user-avatar.component";
import { ChangePasswordComponent } from "@modules/profile/pages/change-password/change-password.component";

const routes: Routes = [
	{
		path: "",
		component: ProfileComponent,
		children: [
			{
				path: "user-information",
				component: UserInformationComponent
			},
			{
				path: "user-avatar",
				component: UserAvatarComponent
			},
			{
				path: "change-password",
				component: ChangePasswordComponent
			}
		]
	},
	{
		path: "**",
		redirectTo: "user-information"
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ProfileRoutingModule {}
