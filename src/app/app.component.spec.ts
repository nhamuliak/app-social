import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AppComponent } from "./app.component";
import { RouterModule, RouterOutlet } from "@angular/router";
import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import { By } from "@angular/platform-browser";
import { MockToastrService } from "@mock/services";
import { ToastrService } from "ngx-toastr";
import * as rxjs from "rxjs";
import { of } from "rxjs";
import { OFFLINE_MESSAGE, ONLINE_MESSAGE } from "@utils/consts";

describe("AppComponent", () => {
	let fixture: ComponentFixture<AppComponent>;
	let app: AppComponent;

	let mockToastrService: MockToastrService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterModule.forRoot([]), FontAwesomeTestingModule, RouterOutlet],
			declarations: [AppComponent],
			providers: [
				{
					provide: ToastrService,
					useClass: MockToastrService
				}
			]
		}).compileComponents();

		mockToastrService = TestBed.inject(ToastrService) as unknown as MockToastrService;

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

	it("should show 'Online' message when online event occurs", () => {
		jest.spyOn(rxjs, "fromEvent").mockReturnValue(of(true));

		app.ngOnInit();

		expect(mockToastrService.info).toHaveBeenCalledWith(ONLINE_MESSAGE);
	});

	it("should show 'Offline' message when offline event occurs", () => {
		jest.spyOn(rxjs, "fromEvent").mockReturnValue(of(false));

		app.ngOnInit();

		expect(mockToastrService.info).toHaveBeenCalledWith(OFFLINE_MESSAGE);
	});
});
