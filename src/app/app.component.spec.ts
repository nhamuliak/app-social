import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AppComponent } from "./app.component";
import { RouterModule } from "@angular/router";

describe("AppComponent", () => {
	let fixture: ComponentFixture<AppComponent>;
	let app: AppComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterModule.forRoot([])],
			declarations: [AppComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(AppComponent);
		app = fixture.componentInstance;
	});

	it("should create the app", () => {
		expect(app).toBeTruthy();
	});
});
