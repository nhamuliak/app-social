import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AuthRoutingModule } from "./auth-routing.module";
import { LoginComponent } from "./pages/login/login.component";
import { RegistrationComponent } from "./pages/registration/registration.component";
import { ResetPasswordComponent } from "./pages/reset-password/reset-password.component";
import { SharedModule } from "@shared/shared.module";
import { RouterModule } from "@angular/router";

@NgModule({
	declarations: [LoginComponent, RegistrationComponent, ResetPasswordComponent],
	imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, AuthRoutingModule, SharedModule]
})
export class AuthModule {}
