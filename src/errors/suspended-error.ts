import { CustomError } from '@/errors/custom-error';

export class SuspendedError extends CustomError {
	statusCode = 403;
	constructor(public message: string) {
		super(message);
		this.message = message;
		Object.setPrototypeOf(this, SuspendedError.prototype);
	}

	serializeErrors() {
		return { message: this.message };
	}
}
