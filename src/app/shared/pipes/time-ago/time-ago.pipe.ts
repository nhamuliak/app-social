import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "timeAgo",
	standalone: true
})
export class TimeAgoPipe implements PipeTransform {
	public transform(value: string): string {
		if (!value) return "";

		const now = new Date();
		const date = new Date(value);
		const time = Math.floor((now.getTime() - date.getTime()) / 1000);

		const SECONDS = 60;
		const MINUTE = SECONDS;
		const HOUR = SECONDS * MINUTE;
		const DAY = SECONDS * MINUTE * 24;

		if (time < MINUTE) return "Just now";
		else if (time < HOUR) return `${Math.floor(time / MINUTE)}m`;
		else if (time < DAY) return `${Math.floor(time / HOUR)}h`;
		else if (time < DAY * 7) return `${Math.floor(time / DAY)}d`;
		else {
			const day = date.getDate().toString().padStart(2, "0");
			const month = (date.getMonth() + 1).toString().padStart(2, "0");
			const year = date.getFullYear();

			return `${day}/${month}/${year}`;
		}
	}
}
