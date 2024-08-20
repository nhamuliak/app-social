import { Subject } from "rxjs";
import { Injectable, OnDestroy } from "@angular/core";

/**
 * Clear Observable class - for easy and handle observable unsubscription in component
 *
 * USAGE:
 * // ClassName extends ClearObservable
 *
 *	Subscription
 *		.pipe(
 *			takeUntil(this.destroy$)
 *		)
 *		.subscribe()
 */
@Injectable()
export class ClearObservable implements OnDestroy {
	public destroy$: Subject<boolean> = new Subject();

	public ngOnDestroy(): void {
		this.destroy$.next(true);
		this.destroy$.complete();
	}
}
