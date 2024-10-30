import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NewChatModalComponent } from "./new-chat-modal.component";
import { mockUserData } from "@mock/data";
import { DialogRef } from "@ngneat/dialog";
import { NO_ERRORS_SCHEMA } from "@angular/core";

class MockDialogRef {
	public data = { users: [mockUserData] };
}

describe("NewChatModalComponent", () => {
	let component: NewChatModalComponent;
	let fixture: ComponentFixture<NewChatModalComponent>;

	const mockDialogRef = new MockDialogRef();

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NewChatModalComponent],
			providers: [
				{
					provide: DialogRef,
					useClass: MockDialogRef
				}
			],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();

		fixture = TestBed.createComponent(NewChatModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should create the component", () => {
		expect(component).toBeTruthy();
	});

	it("should initialize data from dialog reference", () => {
		expect(component.data).toEqual(mockDialogRef.data);
	});

	it("should contain users in data", () => {
		expect(component.data.users).toEqual([mockUserData]);
		expect(component.data.users.length).toBe(1);
	});
});
