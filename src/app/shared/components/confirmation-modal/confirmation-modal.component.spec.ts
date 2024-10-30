import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ConfirmationModalComponent } from "./confirmation-modal.component";
import { DialogRef } from "@ngneat/dialog";
import { By } from "@angular/platform-browser";

const TITLE = "Test Title";

class MockDialogRef {
	public data = { title: TITLE };
	public close = jest.fn();
}

describe("ConfirmationModalComponent", () => {
	let dialogRef: MockDialogRef;
	let component: ConfirmationModalComponent;
	let fixture: ComponentFixture<ConfirmationModalComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ConfirmationModalComponent],
			providers: [{ provide: DialogRef, useClass: MockDialogRef }]
		}).compileComponents();

		fixture = TestBed.createComponent(ConfirmationModalComponent);
		dialogRef = new MockDialogRef();
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

	it("should close the dialog with false when \"Close\" button is clicked", () => {
		const closeButton = fixture.debugElement.query(By.css(".btn-secondary"));

		expect(closeButton).toBeTruthy();

		closeButton.nativeElement.click();

		fixture.whenStable().then(() => {
			expect(dialogRef.close).toHaveBeenCalledWith(false);
		});
	});

	it("should close the dialog with true when \"Confirm\" button is clicked", () => {
		fixture.detectChanges();

		const confirmButton = fixture.debugElement.query(By.css(".btn-primary"));

		expect(confirmButton).toBeTruthy();

		confirmButton.nativeElement.click();

		fixture.whenStable().then(() => {
			expect(component.onClose).toHaveBeenCalledWith(true);
		});
	});
});
