import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { fromEvent, map, merge } from "rxjs";
import { OFFLINE_MESSAGE, ONLINE_MESSAGE } from "@utils/consts";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
	constructor(private toastrService: ToastrService) {}

	public ngOnInit(): void {
		merge(
			fromEvent(window, "online").pipe(map(() => true)),
			fromEvent(window, "offline").pipe(map(() => false))
		).subscribe(status => {
			const message = status ? ONLINE_MESSAGE : OFFLINE_MESSAGE;

			this.toastrService.info(message);
		});
	}
}
