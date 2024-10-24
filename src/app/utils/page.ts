export class Page {
	public pageNumber = 1;
	public size: number;
	public total: number;

	constructor(size = 10) {
		this.size = size;
	}
}
