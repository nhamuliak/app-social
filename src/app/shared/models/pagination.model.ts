export interface PaginationResponse<T = unknown> {
	records: T[];
	total: number;
}
