import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { RouterModule } from "@angular/router";
import { SharedModule } from "@shared/shared.module";
import { AuthRoutingModule } from "./auth-routing.module";
import { LoginComponent } from "./pages/login/login.component";
import { RegistrationComponent } from "./pages/registration/registration.component";
import { ResetPasswordComponent } from "./pages/reset-password/reset-password.component";
import { TermsComponent } from "./pages/terms/terms.component";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

@NgModule({
	declarations: [LoginComponent, RegistrationComponent, ResetPasswordComponent, TermsComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		AuthRoutingModule,
		SharedModule,
		FaIconComponent
	]
})
export class AuthModule {}
