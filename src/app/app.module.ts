import { NgModule } from "@angular/core";
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
		HttpClientModule
	],
	providers: [provideHttpClient(withInterceptors([errorInterceptor, tokenInterceptor]))],
	bootstrap: [AppComponent]
})
export class AppModule {}
