import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TermsComponent } from "./terms.component";
import { Term } from "@modules/auth/models/term.model";
import { mockTermData } from "@mock/data";
import { TermService } from "@modules/auth/services/term/term.service";
import { MockTermService } from "@mock/services";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

describe("TermsComponent", () => {
	let component: TermsComponent;
	let fixture: ComponentFixture<TermsComponent>;

	let termService: MockTermService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FontAwesomeModule],
			declarations: [TermsComponent],
			providers: [
				{
					provide: TermService,
					useClass: MockTermService
				}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(TermsComponent);
		component = fixture.componentInstance;

		termService = TestBed.inject(TermService) as unknown as MockTermService;

		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should initialize terms$ on ngOnInit", () => {
		const mockTerms: Term[] = [mockTermData];

		component.ngOnInit();

		component.terms$.subscribe(terms => {
			expect(terms).toEqual(mockTerms);
		});

		expect(termService.getTerms).toHaveBeenCalled();
	});
});
