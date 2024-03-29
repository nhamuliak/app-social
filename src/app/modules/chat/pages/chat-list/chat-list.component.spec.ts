import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChatListComponent } from "./chat-list.component";
import { ChatService } from "../../services/chat.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("ChatListComponent", () => {
	let component: ChatListComponent;
	let fixture: ComponentFixture<ChatListComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			declarations: [ChatListComponent],
			providers: [ChatService]
		}).compileComponents();

		fixture = TestBed.createComponent(ChatListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
