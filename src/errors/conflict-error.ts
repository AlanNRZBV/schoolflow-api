import { CustomError } from '@/errors/custom-error';

export default class ConflictError extends CustomError {
	statusCode = 409;
	constructor(public message: string) {
		super(message);
		this.message = message;
		Object.setPrototypeOf(this, ConflictError.prototype);
	}

	serializeErrors() {
		return { message: this.message };
	}
}
