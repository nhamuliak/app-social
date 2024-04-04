import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
	{
		path: "auth",
		loadChildren: () => import("./modules/auth/auth.module").then(module => module.AuthModule)
	},
	{
		path: "chat",
		loadChildren: () => import("./modules/chat/chat.module").then(module => module.ChatModule)
	},
	{
		path: "profile",
		loadChildren: () => import("./modules/profile/profile.module").then(module => module.ProfileModule)
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
