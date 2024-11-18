import { NgModule, isDevMode } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { SocketIoModule } from "ngx-socket-io";
import { ToastrModule } from "ngx-toastr";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { HttpClientModule, provideHttpClient, withInterceptors } from "@angular/common/http";
import { tokenInterceptor } from "@core/interceptors/token/token.interceptor";
import { errorInterceptor } from "@core/interceptors/error/error.interceptor";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig } from "@abacritt/angularx-social-login";
import { environment } from "@environments/environment";
import { ServiceWorkerModule } from "@angular/service-worker";

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		ToastrModule.forRoot({
			timeOut: 3000,
			preventDuplicates: true,
			resetTimeoutOnDuplicate: true,
			closeButton: true,
			maxOpened: 5
		}),
		SocketIoModule,
		AppRoutingModule,
		FaIconComponent,
		HttpClientModule,
		ServiceWorkerModule.register("ngsw-worker.js", {
			enabled: !isDevMode(),
			// Register the ServiceWorker as soon as the application is stable
			// or after 30 seconds (whichever comes first).
			registrationStrategy: "registerWhenStable:30000"
		})
	],
	providers: [
		provideHttpClient(withInterceptors([errorInterceptor, tokenInterceptor])),
		{
			provide: "SocialAuthServiceConfig",
			useValue: {
				autoLogin: false,
				providers: [
					{
						id: GoogleLoginProvider.PROVIDER_ID,
						provider: new GoogleLoginProvider(environment.googleClientId)
					},
					{
						id: FacebookLoginProvider.PROVIDER_ID,
						provider: new FacebookLoginProvider(environment.facebookClientId)
					}
				],
				onError: err => {
					console.error(err);
				}
			} as SocialAuthServiceConfig
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
