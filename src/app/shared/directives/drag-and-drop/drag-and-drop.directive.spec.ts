import { DragAndDropDirective } from "./drag-and-drop.directive";
import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

@Component({
	template: `
		<div appDragAndDrop (fileDropped)="onFileDropped($event)" [multiple]="allowMultiple">Drop files here</div>
	`,
	standalone: false
})
class TestComponent {
	public onFileDropped = jest.fn();
	public allowMultiple = false;
}

class MockDragEvent extends Event {
	public dataTransfer: { files: File[] };

	constructor(type: string, eventInitDict?: DragEventInit) {
		super(type, eventInitDict);
		this.dataTransfer = { files: [] };
	}
}

// Mocking DataTransfer for Jest environment
class MockDataTransfer {
	private _files: File[] = [];

	public get files(): File[] {
		return this._files;
	}

	// Method to add files to the DataTransfer
	public add(file: File): void {
		this._files.push(file);
	}

	// Method to simulate adding multiple files
	public items = {
		add: (file: File) => this.add(file)
	};
}

describe("DragAndDropDirective", () => {
	let fixture: ComponentFixture<TestComponent>;
	let testComponent: TestComponent;
	let directiveElement: HTMLElement;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DragAndDropDirective],
			declarations: [TestComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(TestComponent);
		testComponent = fixture.componentInstance;
		directiveElement = fixture.debugElement.query(By.directive(DragAndDropDirective)).nativeElement;

		fixture.detectChanges();
	});

	it("should create an instance", () => {
		const directive = new DragAndDropDirective();
		expect(directive).toBeTruthy();
	});

	it("should add 'file-over' class on dragover and remove it on dragleave", () => {
		const dragOverEvent = new MockDragEvent("dragover");
		const dragLeaveEvent = new MockDragEvent("dragleave");

		directiveElement.dispatchEvent(dragOverEvent);
		fixture.detectChanges();
		expect(directiveElement.classList).toContain("file-over");

		directiveElement.dispatchEvent(dragLeaveEvent);
		fixture.detectChanges();
		expect(directiveElement.classList).not.toContain("file-over");
	});

	it("should emit a single file on drop when multiple is false", () => {
		const dropEvent = new MockDragEvent("drop", {
			// eslint-disable-next-line
			dataTransfer: { files: new MockDataTransfer().files } as any
		});
		Object.defineProperty(dropEvent.dataTransfer, "files", {
			value: [new File(["file content"], "test-file.txt")]
		});

		testComponent.allowMultiple = false;
		fixture.detectChanges();
		directiveElement.dispatchEvent(dropEvent);

		expect(testComponent.onFileDropped).toHaveBeenCalledWith(expect.any(File));
		expect((testComponent.onFileDropped as jest.Mock).mock.calls[0][0].name).toBe("test-file.txt");
	});

	it("should emit multiple files on drop when multiple is true", () => {
		const fileList = [new File(["file content 1"], "file1.txt"), new File(["file content 2"], "file2.txt")];
		const dropEvent = new MockDragEvent("drop", {
			// eslint-disable-next-line
			dataTransfer: { files: new MockDataTransfer().files } as any
		});
		Object.defineProperty(dropEvent.dataTransfer, "files", {
			value: fileList
		});

		testComponent.allowMultiple = true;
		fixture.detectChanges();
		directiveElement.dispatchEvent(dropEvent);

		expect(testComponent.onFileDropped).toHaveBeenCalledWith(fileList);
	});
});
