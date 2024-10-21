import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { SocketIoModule } from "ngx-socket-io";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { HttpClientModule, provideHttpClient, withInterceptors } from "@angular/common/http";
import { tokenInterceptor } from "@core/interceptors/token/token.interceptor";
import { errorInterceptor } from "@core/interceptors/error/error.interceptor";
import { ToastComponent } from "@core/components/toast/toast.component";

@NgModule({
	declarations: [AppComponent],
	imports: [BrowserModule, SocketIoModule, AppRoutingModule, FaIconComponent, HttpClientModule, ToastComponent],
	providers: [provideHttpClient(withInterceptors([errorInterceptor, tokenInterceptor]))],
	bootstrap: [AppComponent]
})
export class AppModule {}
