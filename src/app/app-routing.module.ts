import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "@core/components/home/home.component";
import { noAuthGuard } from "@core/guards/no-auth/no-auth.guard";
import { authGuard } from "@core/guards/auth/auth.guard";

const routes: Routes = [
	{
		path: "auth",
		loadChildren: () => import("./modules/auth/auth.module").then(module => module.AuthModule),
		canActivate: [noAuthGuard]
	},
	{
		path: "",
		component: HomeComponent,
		canActivate: [authGuard],
		children: [
			{
				path: "profile",
				loadChildren: () => import("./modules/profile/profile.module").then(module => module.ProfileModule)
			},
			{
				path: "", // chat
				loadChildren: () => import("./modules/chat/chat.module").then(module => module.ChatModule)
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
