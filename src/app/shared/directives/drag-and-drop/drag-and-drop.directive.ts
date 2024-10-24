import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from "@angular/core";

@Directive({
	selector: "[appDragAndDrop]",
	standalone: true
})
export class DragAndDropDirective {
	@HostBinding("class.file-over") protected fileOver = false;

	// Input property to determine if multiple files are allowed
	@Input() public multiple = false;

	@Output() public fileDropped = new EventEmitter();

	// Dragover listener
	@HostListener("dragover", ["$event"])
	public onDragOver(evt: Event): void {
		evt.preventDefault();
		evt.stopPropagation();
		this.fileOver = true;
	}

	// Dragleave listener
	@HostListener("dragleave", ["$event"])
	public onDragLeave(evt: Event): void {
		evt.preventDefault();
		evt.stopPropagation();
		this.fileOver = false;
	}

	// Drop listener
	@HostListener("drop", ["$event"])
	public onDrop(evt: DragEvent): void {
		evt.preventDefault();
		evt.stopPropagation();
		this.fileOver = false;

		const files = evt.dataTransfer?.files || [];

		if (files.length > 0) {
			if (this.multiple) {
				this.fileDropped.emit(files); // emit all files if multiple is allowed
			} else {
				this.fileDropped.emit(files[0]); // emit only the first file if multiple is not allowed
			}
		}
	}
}
