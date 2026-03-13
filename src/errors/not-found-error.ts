import { CustomError } from '@/errors/custom-error';

export class NotFoundError extends CustomError {
	statusCode = 404;
	constructor(message = 'Not found') {
		super(message);
		this.message = message;
		Object.setPrototypeOf(this, NotFoundError.prototype);
	}
	serializeErrors() {
		return { message: this.message };
	}
}
