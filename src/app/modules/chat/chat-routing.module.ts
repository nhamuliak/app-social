import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ChatListComponent } from "./pages/chat-list/chat-list.component";

const routes: Routes = [
	{
		path: "",
		component: ChatListComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ChatRoutingModule {}
