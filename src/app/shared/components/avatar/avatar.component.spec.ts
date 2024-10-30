import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AvatarComponent } from "./avatar.component";

describe("AvatarComponent", () => {
	let component: AvatarComponent;
	let fixture: ComponentFixture<AvatarComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AvatarComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(AvatarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	// it("should display the provided avatar image", () => {
	// 	component.avatar = "path/to/avatar.jpg";
	//
	// 	const imgElement = fixture.debugElement.query(By.css("#img"));
	// 	expect(imgElement.nativeElement.src).toContain("path/to/avatar.jpg");
	// });
	//
	// it("should display the male default avatar if no avatar is provided and male is true", () => {
	// 	component.male = true;
	// 	component.avatar = null;
	//
	// 	fixture.detectChanges();
	//
	// 	const imgElement = fixture.debugElement.query(By.css("img#boy"));
	// 	expect(imgElement.nativeElement.src).toContain("http://localhost/assets/images/avatar-boy-default.png");
	// });
	//
	// it("should display the female default avatar if no avatar is provided and male is false", () => {
	// 	component.male = false;
	// 	component.avatar = null;
	//
	// 	fixture.detectChanges();
	//
	// 	const imgElement = fixture.debugElement.query(By.css("img#girl"));
	// 	expect(imgElement.nativeElement.src).toContain("http://localhost/assets/images/avatar-girl-default.png");
	// });
	//
	// it("should apply the correct size class", () => {
	// 	component.sizeClass = "lg";
	//
	// 	fixture.detectChanges();
	//
	// 	const avatarElement = fixture.debugElement.query(By.css(".avatar"));
	// 	expect(avatarElement.classes["lg"]).toBeTruthy();
	// });
});
