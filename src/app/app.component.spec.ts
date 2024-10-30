import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AppComponent } from "./app.component";
import { RouterModule, RouterOutlet } from "@angular/router";
import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import { By } from "@angular/platform-browser";

describe("AppComponent", () => {
	let fixture: ComponentFixture<AppComponent>;
	let app: AppComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterModule.forRoot([]), FontAwesomeTestingModule, RouterOutlet],
			declarations: [AppComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(AppComponent);
		app = fixture.componentInstance;
	});

	it("should create the app", () => {
		expect(app).toBeTruthy();
	});

	it("should render the router outlet", () => {
		const routerOutlet = fixture.debugElement.query(By.directive(RouterOutlet));
		expect(routerOutlet).toBeTruthy();
	});
});
