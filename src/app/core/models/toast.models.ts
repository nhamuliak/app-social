import { ToastEnum } from "@core/enums/toast.enum";

export interface Toast {
	type: ToastEnum;
	message: string;
	action: unknown;
	actionLabel: string;
	close: unknown;
	errors?: ToastErrorMessage[];
}

export interface ToastErrorMessage {
	location: string;
	msg: string;
	param: string;
	value: string;
}
