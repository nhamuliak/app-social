import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root"
})
export class AudioService {
	private audio: HTMLAudioElement;

	constructor() {
		this.audio = new Audio("./assets/sounds/notification.wav");
		this.audio.volume = 0.5;
	}

	public playNotification(): void {
		this.audio.play();
	}
}
