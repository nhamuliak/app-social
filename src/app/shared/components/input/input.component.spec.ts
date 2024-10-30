import { ComponentFixture, TestBed } from "@angular/core/testing";

import { InputComponent } from "./input.component";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule } from "@angular/forms";

class MockNgControl {
	public valueAccessor: ControlValueAccessor;
	public errors: { [key: string]: unknown } | null = null;
	public touched = false;
}

describe("InputComponent", () => {
	let component: InputComponent;
	let fixture: ComponentFixture<InputComponent>;
	let mockNgControl: MockNgControl;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule],
			declarations: [InputComponent],
			providers: [
				{
					provide: NG_VALUE_ACCESSOR,
					useExisting: InputComponent,
					multi: true
				},
				{
					provide: NgControl,
					useValue: mockNgControl
				}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(InputComponent);

		component = fixture.componentInstance;
		fixture.detectChanges();

		mockNgControl = new MockNgControl();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should initialize with default values", () => {
		expect(component.type).toBe("text");
		expect(component.placeholder).toBe("Type something...");
		expect(component.value).toBe("");
		expect(component.disabled).toBe(false);
	});

	it("should handle input change", () => {
		component.onInput({ value: "new value" });
		expect(component.value).toBe("new value");
	});

	it("should register change and touch handlers", () => {
		const onChangeSpy = jest.fn();
		const onTouchedSpy = jest.fn();

		component.registerOnChange(onChangeSpy);
		component.registerOnTouched(onTouchedSpy);

		component.onInput({ value: "test" });
		expect(onChangeSpy).toHaveBeenCalledWith("test");

		component.onBlur();
		expect(onTouchedSpy).toHaveBeenCalled();
	});

	it("should set disabled state", () => {
		component.setDisabledState(true);
		expect(component.disabled).toBe(true);
	});
});
