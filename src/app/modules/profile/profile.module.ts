import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProfileRoutingModule } from "./profile-routing.module";
import { ManageAccountComponent } from "./pages/manage-account/manage-account.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
	declarations: [ManageAccountComponent],
	imports: [CommonModule, ProfileRoutingModule, FormsModule, ReactiveFormsModule]
})
export class ProfileModule {}
