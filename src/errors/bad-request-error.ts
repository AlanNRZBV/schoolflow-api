import { CustomError } from '@/errors/custom-error';

export default class BadRequestError extends CustomError {
	statusCode = 400;
	constructor(public message: string) {
		super(message);
		this.message = message;
		Object.setPrototypeOf(this, BadRequestError.prototype);
	}

	serializeErrors(): { message: string } {
		return { message: this.message };
	}
}
