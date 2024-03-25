import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { AppComponent } from "./app.component";

describe("AppComponent", () => {
	let fixture: ComponentFixture<AppComponent>;
	let app: AppComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [AppComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(AppComponent);
		app = fixture.componentInstance;
	});

	it("should create the app", () => {
		expect(app).toBeTruthy();
	});

	// it("should have as title 'app-social'", () => {
	// 	expect(app.title).toEqual("app-social");
	// });

	// it("should render title", () => {
	// 	const compiled = fixture.nativeElement as HTMLElement;
	//
	// 	fixture.detectChanges();
	// 	expect(compiled.querySelector(".content span")?.textContent).toContain(
	// 		"app-social app is running!"
	// 	);
	// });
});
