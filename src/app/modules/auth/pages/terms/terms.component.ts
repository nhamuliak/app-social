import { Observable } from "rxjs";
import { Component, OnInit } from "@angular/core";
import { TermService } from "@modules/auth/services/term/term.service";
import { Term } from "@modules/auth/models/term.models";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

@Component({
	selector: "app-terms",
	templateUrl: "./terms.component.html",
	styleUrl: "./terms.component.scss"
})
export class TermsComponent implements OnInit {
	public terms$: Observable<Term[]>;

	constructor(private termService: TermService) {}

	public ngOnInit(): void {
		this.terms$ = this.termService.getTerms();
	}

	protected readonly faAngleLeft = faAngleLeft;
}
