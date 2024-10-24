export interface PaginationResponse<T = unknown> {
	records: T;
	page: number;
}
