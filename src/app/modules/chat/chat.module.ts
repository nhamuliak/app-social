import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ChatRoutingModule } from "./chat-routing.module";
import { ChatListComponent } from "./pages/chat-list/chat-list.component";
import { ChatRoomComponent } from "./pages/chat-room/chat-room.component";

@NgModule({
	declarations: [ChatListComponent, ChatRoomComponent],
	imports: [CommonModule, ChatRoutingModule]
})
export class ChatModule {}
