import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from "./pages/login/login.component";
import { RegistrationComponent } from "./pages/registration/registration.component";
import { ResetPasswordComponent } from "./pages/reset-password/reset-password.component";

const routes: Routes = [
	{
		path: "login",
		component: LoginComponent
	},
	{
		path: "registration",
		component: RegistrationComponent
	},
	{
		path: "reset-password",
		component: ResetPasswordComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AuthRoutingModule {}
