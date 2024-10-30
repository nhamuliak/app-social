import { TimeAgoPipe } from "./time-ago.pipe";

describe("TimeAgoPipe", () => {
	let pipe: TimeAgoPipe;

	beforeEach(() => {
		pipe = new TimeAgoPipe();
	});

	it("create an instance", () => {
		const pipe = new TimeAgoPipe();
		expect(pipe).toBeTruthy();
	});

	it("should return \"Just now\" for dates within the last minute", () => {
		const date = new Date();
		expect(pipe.transform(date.toISOString())).toBe("Just now");
	});

	it("should return minutes ago format for dates within the last hour", () => {
		const date = new Date(new Date().getTime() - 5 * 60 * 1000); // 5 minutes ago
		expect(pipe.transform(date.toISOString())).toBe("5m");
	});

	it("should return hours ago format for dates within the last day", () => {
		const date = new Date(new Date().getTime() - 2 * 60 * 60 * 1000); // 2 hours ago
		expect(pipe.transform(date.toISOString())).toBe("2h");
	});

	it("should return days ago format for dates within the last week", () => {
		const date = new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
		expect(pipe.transform(date.toISOString())).toBe("3d");
	});

	it("should return formatted date for dates older than a week", () => {
		const date = new Date("2023-01-01T00:00:00Z");
		expect(pipe.transform(date.toISOString())).toBe("01/01/2023");
	});

	it("should return an empty string if the value is invalid or empty", () => {
		expect(pipe.transform("")).toBe("");
		expect(pipe.transform(null as unknown as string)).toBe("");
	});
});
