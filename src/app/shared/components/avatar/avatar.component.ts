import { Component, Input } from "@angular/core";
import { NgClass } from "@angular/common";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

@Component({
	selector: "app-avatar",
	standalone: true,
	imports: [NgClass],
	templateUrl: "./avatar.component.html",
	styleUrl: "./avatar.component.scss"
})
export class AvatarComponent {
	@Input() public sizeClass: Size = "sm";
	@Input() public avatar: string | null;
	@Input() public male = false;
}
