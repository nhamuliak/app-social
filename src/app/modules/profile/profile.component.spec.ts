import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ProfileComponent } from "./profile.component";
import { By } from "@angular/platform-browser";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { MockRouterOutletComponent } from "@mock/components";

class MockActivatedRoute {
	public snapshot = {
		children: [
			{
				url: [{ path: "user-information" }] // This can be modified for testing other tabs
			}
		]
	};
}

describe("ProfileComponent", () => {
	let component: ProfileComponent;
	let fixture: ComponentFixture<ProfileComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MockRouterOutletComponent, RouterModule],
			declarations: [ProfileComponent],
			providers: [
				{
					provide: ActivatedRoute,
					useClass: MockActivatedRoute
				}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(ProfileComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should render the router outlet", () => {
		const routerOutlet = fixture.debugElement.query(By.css("router-outlet"));
		expect(routerOutlet).toBeTruthy();
	});

	it("should set the active class for \"Edit Information\" link", () => {
		const link = fixture.debugElement.query(By.css("a:nth-of-type(1)"));
		expect(link.classes["active"]).toBeTruthy();
	});

	it("should set the active class for \"User Avatar\" link", () => {
		const mockRouter = TestBed.inject(ActivatedRoute) as MockActivatedRoute;
		mockRouter.snapshot.children[0].url[0].path = "user-avatar";

		fixture.detectChanges();

		const link = fixture.debugElement.query(By.css("a:nth-of-type(2)"));
		expect(link.classes["active"]).toBeTruthy();
	});

	it("should set the active class for \"Change Password\" link", () => {
		const mockRouter = TestBed.inject(ActivatedRoute) as MockActivatedRoute;
		mockRouter.snapshot.children[0].url[0].path = "change-password";
		fixture.detectChanges();

		const link = fixture.debugElement.query(By.css("a:nth-of-type(3)"));
		expect(link.classes["active"]).toBeTruthy();
	});
});
