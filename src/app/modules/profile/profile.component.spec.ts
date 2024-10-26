import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ProfileComponent } from "./profile.component";
import { By } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { MockRouterOutlet } from "@mock/components";

class MockActivatedRoute {
	snapshot = {
		children: [
			{
				url: [{ path: "user-information" }] // This can be modified for testing other tabs
			}
		]
	};
}

describe("ProfileComponent", () => {
	let activatedRouteMock: MockActivatedRoute;
	let component: ProfileComponent;
	let fixture: ComponentFixture<ProfileComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ProfileComponent, MockRouterOutlet],
			providers: [
				{
					provide: ActivatedRoute,
					useValue: MockActivatedRoute
				}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(ProfileComponent);
		component = fixture.componentInstance;
		activatedRouteMock = new MockActivatedRoute();
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should render the router outlet", () => {
		const routerOutlet = fixture.debugElement.query(By.directive(MockRouterOutlet));
		expect(routerOutlet).toBeTruthy();
	});

	it('should set the active class for "Edit Information" link', () => {
		const link = fixture.debugElement.query(By.css("a:nth-of-type(1)"));
		expect(link.classes["active"]).toBeTruthy();
	});

	it('should set the active class for "User Avatar" link', () => {
		activatedRouteMock.snapshot.children[0].url[0].path = "user-avatar";
		fixture.detectChanges();

		const link = fixture.debugElement.query(By.css("a:nth-of-type(2)"));
		expect(link.classes["active"]).toBeTruthy();
	});

	it('should set the active class for "Change Password" link', () => {
		activatedRouteMock.snapshot.children[0].url[0].path = "change-password";
		fixture.detectChanges();

		const link = fixture.debugElement.query(By.css("a:nth-of-type(3)"));
		expect(link.classes["active"]).toBeTruthy();
	});
});
