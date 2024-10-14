import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Term } from "@modules/auth/models/term.models";

@Injectable({
	providedIn: "root"
})
export class TermService {
	private urlPath = "http://localhost:3000/api";

	constructor(private http: HttpClient) {}

	public getTerms(): Observable<Term[]> {
		return this.http.get<Term[]>(`${this.urlPath}/terms`);
	}
}
