import { ClickOutsideDirective } from "./click-outside.directive";
import { Component, ElementRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

@Component({
	template: " <div appClickOutside (clickOutside)=\"onOutsideClick()\">Menu Content</div> "
})
class TestComponent {
	public onOutsideClick = jest.fn();
}

describe("ClickOutsideDirective", () => {
	let fixture: ComponentFixture<TestComponent>;
	let testComponent: TestComponent;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ClickOutsideDirective],
			declarations: [TestComponent]
		});

		fixture = TestBed.createComponent(TestComponent);
		testComponent = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create an instance", () => {
		const directive = new ClickOutsideDirective(new ElementRef(null));
		expect(directive).toBeTruthy();
	});

	it("should not emit clickOutside event when clicking inside the element", () => {
		const element = fixture.debugElement.query(By.directive(ClickOutsideDirective));
		element.nativeElement.click();
		fixture.detectChanges();

		expect(testComponent.onOutsideClick).not.toHaveBeenCalled();
	});

	it("should emit clickOutside event when clicking outside the element", () => {
		// Simulate clicking outside
		document.body.click();
		fixture.detectChanges();

		expect(testComponent.onOutsideClick).toHaveBeenCalled();
	});
});
