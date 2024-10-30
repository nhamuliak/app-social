import { of } from "rxjs";
import { mockTermData } from "../data";

export class MockTermService {
	public getTerms = jest.fn().mockReturnValue(of([mockTermData]));
}
