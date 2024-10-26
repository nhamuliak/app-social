import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LoaderComponent } from "./loader.component";
import { By } from "@angular/platform-browser";

describe("LoaderComponent", () => {
	let component: LoaderComponent;
	let fixture: ComponentFixture<LoaderComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [LoaderComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(LoaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should display the loader when loading is true", () => {
		component.loading = true;

		const loaderElement = fixture.debugElement.query(By.css(".loader"));
		expect(loaderElement).toBeTruthy();
	});

	it("should hide the loader when loading is false", () => {
		component.loading = false;

		const loaderElement = fixture.debugElement.query(By.css(".loader"));
		expect(loaderElement).toBeFalsy();
	});

	it("should display loader in a wrapper when coverPage is true", () => {
		component.loading = true;
		component.coverPage = true;

		const wrapperElement = fixture.debugElement.query(By.css(".loader-wrapper"));
		const loaderElement = fixture.debugElement.query(By.css(".loader"));

		expect(wrapperElement).toBeTruthy();
		expect(loaderElement).toBeTruthy();
	});

	it("should display loader without wrapper when coverPage is false", () => {
		component.loading = true;
		component.coverPage = false;

		const wrapperElement = fixture.debugElement.query(By.css(".loader-wrapper"));
		const loaderElement = fixture.debugElement.query(By.css(".loader"));

		expect(wrapperElement).toBeFalsy();
		expect(loaderElement).toBeTruthy();
	});
});
