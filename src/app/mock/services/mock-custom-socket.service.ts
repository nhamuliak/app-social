import { Observable, of } from "rxjs";

export class MockCustomSocketService {
	public events: { [key: string]: unknown[] } = {};

	public fromEvent(event: string): Observable<unknown> {
		return of(...(this.events[event] || []));
	}

	public emit(event: string, data: unknown): void {
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(data); // Store emitted data
	}

	public open = jest.fn();
}
