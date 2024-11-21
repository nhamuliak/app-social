import { TestBed } from "@angular/core/testing";
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from "@angular/common/http";

import { cacheInterceptor } from "./cache.interceptor";
import { of } from "rxjs";
import { openDB } from "idb";

jest.mock("idb");

describe("cacheInterceptor", () => {
	const interceptor: HttpInterceptorFn = (req, next) =>
		TestBed.runInInjectionContext(() => cacheInterceptor(req, next));

	const mockCacheKey = "mockEndpoint";
	const mockDb = {
		get: jest.fn(),
		put: jest.fn()
	};
	let mockHandler: jest.Mocked<HttpHandlerFn> = jest.fn();

	beforeEach(() => {
		TestBed.configureTestingModule({});

		// Mock IndexedDB
		(openDB as jest.Mock).mockResolvedValue(mockDb);
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should be created", () => {
		expect(interceptor).toBeTruthy();
	});

	it("should pass the request to the next handler when the method is not GET", done => {
		const request = new HttpRequest("DELETE", "api/test");

		mockHandler = jest.fn().mockReturnValue(of(new HttpResponse()));

		const result$ = cacheInterceptor(request, mockHandler);
		result$.subscribe(() => {
			expect(mockHandler).toHaveBeenCalledWith(request);
			done();
		});
	});

	it("should return cached data when offline and data is available", done => {
		const request = new HttpRequest("GET", `api/${mockCacheKey}`);
		const cachedData = { mock: "data" };

		mockDb.get.mockResolvedValue(cachedData);
		Object.defineProperty(navigator, "onLine", { value: false, configurable: true });

		const result$ = cacheInterceptor(request, mockHandler);
		result$.subscribe(event => {
			expect(event).toBeInstanceOf(HttpResponse);
			const response = event as HttpResponse<unknown>;
			expect(response.body).toEqual(cachedData);
			expect(response.status).toBe(200);
			done();
		});
	});

	it("should return an offline error when offline and no cached data is available", done => {
		const request = new HttpRequest("GET", `api/${mockCacheKey}`);
		mockDb.get.mockResolvedValue(undefined);
		Object.defineProperty(navigator, "onLine", { value: false, configurable: true });

		const result$ = cacheInterceptor(request, mockHandler);
		result$.subscribe(event => {
			expect(event).toBeInstanceOf(HttpResponse);
			const response = event as HttpResponse<unknown>;
			expect(response.body).toEqual({ message: "No cached data available, you are offline" });
			expect(response.status).toBe(500);
			done();
		});
	});

	it("should handle errors during database operations gracefully", done => {
		const request = new HttpRequest("GET", `api/${mockCacheKey}`);
		mockDb.get.mockRejectedValue(new Error("DB Error"));
		Object.defineProperty(navigator, "onLine", { value: false, configurable: true });

		const result$ = cacheInterceptor(request, mockHandler);
		result$.subscribe(event => {
			expect(event).toBeInstanceOf(HttpResponse);
			const response = event as HttpResponse<unknown>;
			expect(response.body).toEqual({ message: "Error retrieving cache" });
			expect(response.status).toBe(500);
			done();
		});
	});
});
