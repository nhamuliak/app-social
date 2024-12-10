import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "@environments/environment";
import { enableProdMode } from "@angular/core";

if (environment.production) {
	enableProdMode();

	if ("serviceWorker" in navigator) {
		navigator.serviceWorker
			.register("/ngsw-worker.js")
			.then(() => console.info("Service Worker Registered"))
			.catch(err => console.error("Service Worker Registration Failed", err));
	}
}

platformBrowserDynamic()
	.bootstrapModule(AppModule)
	.catch(err => console.error(err));
