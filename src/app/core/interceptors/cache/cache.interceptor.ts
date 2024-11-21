import { HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { catchError, Observable, of, switchMap } from "rxjs";
import { openDB } from "idb";
import { environment } from "@environments/environment";

const getCacheKey = (req: HttpRequest<unknown>): string => {
	return req.url.split("api/").pop() ?? "";
};

export const cacheInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<unknown>> => {
	const dbPromise = openDB(environment.indexDBName, 1, {
		upgrade(idb) {
			if (!idb.objectStoreNames.contains(environment.indexDBTableName)) {
				idb.createObjectStore(environment.indexDBTableName);
			}
		}
	});

	if (req.method !== "GET") {
		return next(req);
	}

	const cacheKey = getCacheKey(req);

	if (!navigator.onLine) {
		// If the user is offline, attempt to return cached data
		return new Observable<HttpEvent<unknown>>(observer => {
			dbPromise
				.then(idb => idb.get(environment.indexDBTableName, cacheKey))
				.then(cachedData => {
					if (cachedData) {
						// Return the cached data as the response
						observer.next(new HttpResponse({ body: cachedData, status: 200 }));
					} else {
						// Return a fallback message if no cache
						observer.next(
							new HttpResponse({
								body: { message: "No cached data available, you are offline" },
								status: 500
							})
						);
					}
					observer.complete();
				})
				.catch(() => {
					// Return a fallback message in case of cache error
					observer.next(new HttpResponse({ body: { message: "Error retrieving cache" }, status: 500 }));
					observer.complete();
				});
		});
	}

	// If online, proceed with the request and cache the response
	return next(req).pipe(
		switchMap((event: HttpEvent<unknown>) => {
			if (event instanceof HttpResponse) {
				// Cache the response for future use
				dbPromise.then(idb => {
					idb.put(environment.indexDBTableName, event.body, cacheKey);
				});
			}
			return of(event); // Return the response (whether cached or fresh)
		}),
		catchError((error: HttpErrorResponse) => {
			return of(error); // Return any errors that occur
		})
	) as Observable<HttpEvent<unknown>>;
};
