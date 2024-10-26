import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ConfirmationModalComponent } from "./confirmation-modal.component";
import { DialogRef } from "@ngneat/dialog";
import { By } from "@angular/platform-browser";

class MockDialogRef {
	data: { title: string };
	close = jest.fn();

	constructor(title: string) {
		this.data = { title };
	}
}

const TITLE = "Test Title";

describe("ConfirmationModalComponent", () => {
	let dialogRef: MockDialogRef;
	let component: ConfirmationModalComponent;
	let fixture: ComponentFixture<ConfirmationModalComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ConfirmationModalComponent],
			providers: [{ provide: DialogRef, useValue: MockDialogRef }]
		}).compileComponents();

		fixture = TestBed.createComponent(ConfirmationModalComponent);
		dialogRef = new MockDialogRef(TITLE);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should display the title from data", () => {
		const titleElement = fixture.debugElement.query(By.css(".title"));
		expect(titleElement.nativeElement.textContent).toContain(TITLE);
	});

	it('should close the dialog with false when "Close" button is clicked', () => {
		const closeButton = fixture.debugElement.query(By.css(".btn-secondary"));
		closeButton.triggerEventHandler("click", null);

		expect(dialogRef.close).toHaveBeenCalledWith(false);
	});

	it('should close the dialog with true when "Confirm" button is clicked', () => {
		const confirmButton = fixture.debugElement.query(By.css(".btn-primary"));
		confirmButton.triggerEventHandler("click", null);

		expect(dialogRef.close).toHaveBeenCalledWith(true);
	});
});
