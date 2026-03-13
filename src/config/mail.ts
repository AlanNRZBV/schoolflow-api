import nodemailer from 'nodemailer';

const { SMTP_USER, SMTP_PASS } = process.env;

if (!SMTP_USER || !SMTP_PASS) {
	throw new Error('Нет переменных окружения в сервисе почты');
}

export const transporter = nodemailer.createTransport({
	service: 'gmail',
	port: 465,
	secure: true,
	pool: true,
	auth: { user: SMTP_USER, pass: SMTP_PASS },
	maxMessages: 50,
	rateLimit: 5,
});

export const verifySmtpConnection = async () => {
	try {
		console.log('Проверка SMTP-соединения...');
		await transporter.verify();
		console.log('SMTP-соединение успешно установлено');
		return true;
	} catch (error) {
		console.error('Ошибка SMTP-соединения:', error);
		return false;
	}
};
