import { Component } from "@angular/core";

@Component({
	selector: "app-mock-router-outlet",
	template: "<ng-content></ng-content>",
	standalone: true
})
export class MockRouterOutletComponent {}
