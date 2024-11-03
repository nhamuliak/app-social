import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { RouterModule } from "@angular/router";
import { AuthRoutingModule } from "./auth-routing.module";
import { LoginComponent } from "./pages/login/login.component";
import { RegistrationComponent } from "./pages/registration/registration.component";
import { ResetPasswordComponent } from "./pages/reset-password/reset-password.component";
import { TermsComponent } from "./pages/terms/terms.component";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { GoogleSigninButtonModule } from "@abacritt/angularx-social-login";
import { FormErrorComponent } from "@shared/components/form-error/form-error.component";
import { SocialsComponent } from "./components/socials/socials.component";
import { LoaderComponent } from "@shared/components/loader/loader.component";
import { RecoveryPasswordComponent } from "./pages/recovery-password/recovery-password.component";

@NgModule({
	declarations: [
		LoginComponent,
		RegistrationComponent,
		ResetPasswordComponent,
		TermsComponent,
		SocialsComponent,
		RecoveryPasswordComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		AuthRoutingModule,
		FaIconComponent,
		GoogleSigninButtonModule,
		FormErrorComponent,
		LoaderComponent
	]
})
export class AuthModule {}
