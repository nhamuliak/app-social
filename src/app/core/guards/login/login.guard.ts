import { CanActivateFn } from "@angular/router";

export const loginGuard: CanActivateFn = () => {
	return true;
};
