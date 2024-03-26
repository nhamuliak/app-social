import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ChatRoutingModule } from "./chat-routing.module";
import { ChatListComponent } from "./pages/chat-list/chat-list.component";

@NgModule({
	declarations: [ChatListComponent],
	imports: [CommonModule, ChatRoutingModule]
})
export class ChatModule {}
