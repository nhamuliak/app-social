import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProfileRoutingModule } from "./profile-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ProfileComponent } from "./profile.component";
import { UserInformationComponent } from "./pages/user-information/user-information.component";
import { UserAvatarComponent } from "./pages/user-avatar/user-avatar.component";
import { ChangePasswordComponent } from "./pages/change-password/change-password.component";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { DragAndDropDirective } from "@shared/directives/drag-and-drop/drag-and-drop.directive";
import { LoaderComponent } from "@shared/components/loader/loader.component";

@NgModule({
	declarations: [ProfileComponent, UserInformationComponent, UserAvatarComponent, ChangePasswordComponent],
	imports: [
		CommonModule,
		ProfileRoutingModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		FaIconComponent,
		DragAndDropDirective,
		LoaderComponent
	]
})
export class ProfileModule {}
