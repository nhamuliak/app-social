import { TestBed } from "@angular/core/testing";

import { TermService } from "./term.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { Term } from "@modules/auth/models/term.model";
import { mockTermData } from "@mock/data";
import { environment } from "@environments/environment";

describe("TermService", () => {
	let service: TermService;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule]
		});
		service = TestBed.inject(TermService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpMock.verify(); // Ensure no outstanding requests
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});

	it("should fetch terms with a GET request", done => {
		const mockTerms: Term[] = [mockTermData];

		service.getTerms().subscribe(terms => {
			expect(terms).toEqual(mockTerms);
			done();
		});

		const req = httpMock.expectOne(`${environment.apiUrl}/terms`);
		expect(req.request.method).toBe("GET");
		req.flush(mockTerms);
	});
});
