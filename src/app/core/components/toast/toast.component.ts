import { Component, OnInit } from "@angular/core";
import { ClearObservable } from "@utils/clear-observable";
import { Toast } from "@core/models/toast.models";
import { ToastService } from "@core/services/toast/toast.service";
import { takeUntil } from "rxjs";
import { animate, style, transition, trigger } from "@angular/animations";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@Component({
	selector: "app-toast",
	standalone: true,
	imports: [BrowserAnimationsModule],
	templateUrl: "./toast.component.html",
	styleUrl: "./toast.component.scss",
	animations: [
		// make the alerts pretty
		trigger("fadeIn", [
			transition(":enter", [style({ opacity: "0" }), animate("0.2s ease-in", style({ opacity: "1" }))])
		]),
		trigger("fadeOut", [
			transition(":leave", [style({ opacity: "1" }), animate("0.3s ease-out", style({ opacity: "0" }))])
		])
	]
})
export class ToastComponent extends ClearObservable implements OnInit {
	public messages: Toast[] = [];

	constructor(private toastService: ToastService) {
		super();
	}

	public ngOnInit(): void {
		this.initMessages();
	}

	private initMessages(): void {
		this.toastService
			.messageSource()
			.pipe(takeUntil(this.destroy$))
			.subscribe(messages => {
				this.messages = messages;
			});
	}
}
