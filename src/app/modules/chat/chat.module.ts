import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ChatRoutingModule } from "./chat-routing.module";
import { ChatListComponent } from "./pages/chat-list/chat-list.component";
import { ChatRoomComponent } from "./pages/chat-room/chat-room.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AvatarComponent } from "@shared/components/avatar/avatar.component";
import { TimeAgoPipe } from "@shared/pipes/time-ago/time-ago.pipe";
import { PickerComponent } from "@ctrl/ngx-emoji-mart";
import { FormsModule } from "@angular/forms";

@NgModule({
	declarations: [ChatListComponent, ChatRoomComponent],
	imports: [
		CommonModule,
		ChatRoutingModule,
		FontAwesomeModule,
		AvatarComponent,
		TimeAgoPipe,
		PickerComponent,
		FormsModule
	]
})
export class ChatModule {}
