import { Injectable } from "@angular/core";
import { AuthConfig, OAuthService } from "angular-oauth2-oidc";
import { environment } from "@environments/environment";
// import { HttpClient } from "@angular/common/http";

const googleAuthConfig: AuthConfig = {
	issuer: "https://accounts.google.com",
	clientId: environment.googleClientId,
	redirectUri: window.location.origin,
	scope: "openid profile email",
	strictDiscoveryDocumentValidation: false
};

@Injectable({
	providedIn: "root"
})
export class GoogleAuthService {
	constructor(
		// private http: HttpClient,
		private readonly oAuthService: OAuthService
	) {
		this.configure();
	}

	private configure(): void {
		this.oAuthService.configure(googleAuthConfig);
		// this.oAuthService.loadDiscoveryDocumentAndTryLogin();
	}

	// public initConfigs(): void {
	// 	this.http.get(`${environment.apiUrl}/auth/google-config`).subscribe((data: any) => {
	// 		googleAuthConfig.issuer = data.issuer;
	//
	// 		this.oAuthService.configure(googleAuthConfig);
	// 		this.oAuthService.loadDiscoveryDocument().then(() => {
	// 			this.oAuthService.tryLoginImplicitFlow().then(() => {
	// 				if (!this.oAuthService.hasValidAccessToken()) {
	// 					this.oAuthService.initLoginFlow();
	// 				} else {
	// 					this.oAuthService.loadUserProfile().then(profile => {
	// 						console.log("google user profile: ", profile);
	// 					});
	// 				}
	// 			});
	// 		});
	// 	});
	// }

	public loginWithGoogle(): void {
		this.oAuthService.initLoginFlow();
	}

	public logoutWithGoogle(): void {
		this.oAuthService.logOut();
	}
}
