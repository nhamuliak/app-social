import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Term } from "@modules/auth/models/term.model";
import { environment } from "@environments/environment";

@Injectable({
	providedIn: "root"
})
export class TermService {
	private urlPath = `${environment.apiUrl}/terms`;

	constructor(private http: HttpClient) {}

	public getTerms(): Observable<Term[]> {
		return this.http.get<Term[]>(this.urlPath);
	}
}
