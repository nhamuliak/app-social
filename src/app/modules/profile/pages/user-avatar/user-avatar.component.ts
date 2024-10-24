import { Component } from "@angular/core";
import { faCloudUpload } from "@fortawesome/free-solid-svg-icons";
import { ProfileService } from "@modules/profile/services/profile/profile.service";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { finalize, takeUntil } from "rxjs";
import { ClearObservable } from "@utils/clear-observable";
import { StoreService } from "@core/services/store/store.service";
import { ToastrService } from "ngx-toastr";
import { User } from "@shared/models/user.model";

@Component({
	selector: "app-user-avatar",
	templateUrl: "./user-avatar.component.html",
	styleUrl: "./user-avatar.component.scss"
})
export class UserAvatarComponent extends ClearObservable {
	protected readonly faCloudUpload = faCloudUpload;

	public loading = false;
	public previewImage: string | ArrayBuffer | null = null;
	public file: File | null = null;

	constructor(
		private authService: AuthService,
		private profileService: ProfileService,
		private toastrService: ToastrService,
		private storeService: StoreService
	) {
		super();
	}

	public onFileDropped(file: File): void {
		this.setupFile(file);
	}

	public onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;

		if (input.files) this.setupFile(input.files[0]);

		input.value = "";
	}

	public onSaveFile(): void {
		if (this.file) {
			this.loading = true;
			const user = this.authService.getUser();

			this.profileService
				.updateUserAvatar(user.id, this.file)
				.pipe(
					finalize(() => (this.loading = false)),
					takeUntil(this.destroy$)
				)
				.subscribe((user: User) => {
					this.storeService.setItem("user", user);

					this.previewImage = null;
					this.file = null;

					this.authService.userSubject.next(user);

					this.toastrService.success("The avatar was updated.");
				});
		}
	}

	private setupFile(file: File): void {
		if (file.type.startsWith("image/")) {
			const reader = new FileReader();

			// Once the file is loaded, set the preview image
			reader.onload = () => {
				this.previewImage = reader.result;
			};

			// Read the file as a data URL (base64 string)
			reader.readAsDataURL(file);

			this.file = file;
		} else {
			this.toastrService.info("Please select an image file.");
		}
	}
}
