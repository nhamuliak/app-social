import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RegistrationComponent } from "./registration.component";
import { RouterModule } from "@angular/router";

describe("RegistrationComponent", () => {
	let component: RegistrationComponent;
	let fixture: ComponentFixture<RegistrationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterModule.forRoot([])],
			declarations: [RegistrationComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(RegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
