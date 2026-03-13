import { transporter } from '@/config/mail';
import { UserType, UserMethods } from '@/models/user/base/user.base.types';
import { HydratedDocument } from 'mongoose';
import { PersonnelAssignmentType } from '@/models/personnel-assignment/personnel-assigments.types';

export const sendWelcomeEmailToNewUser = async (
	user: HydratedDocument<UserType, UserMethods>,
	assignment: HydratedDocument<PersonnelAssignmentType>,
	otp: string,
	schoolName: string,
) => {
	const { firstName, lastName, middleName, email } = user;
	const html = `
      <div>
				<h1>Приглашение в школу</h1>
				<p>Добрый день, ${firstName} ${lastName} ${middleName}!</p>
				<p>Вас приглашают в учреждение: <b>${schoolName}</b></p>
				<p>На позицию <b>${schoolName}</b></p>
			<hr>
				<p>Для начала работы используйте следующие данные для входа:</p>
				<p>
					Логин: ${email}<br>
					Одноразовый пароль: ${otp}
				</p>
				<p>Пожалуйста, войдите в систему и смените пароль на постоянный. Это поможет обеспечить безопасность вашего аккаунта.</p>
				<p>Если пароль не будет изменен в течение 24 часов, аккаунт будет временно заблокирован. В таком случае свяжитесь с администратором для восстановления доступа.</p>
				<p>Если у вас возникнут вопросы, обращайтесь к нам. Желаем успешной работы!</p>
			</div>
    `;
	try {
		await transporter.sendMail({
			from: `"Школьная система" <${process.env.SMTP_USER}>`,
			to: email,
			subject: 'Приглашение в систему школы',
			html,
		});
	} catch (e) {
		throw new Error('Не удалось отправить письмо');
	}
};

export const sendWelcomeEmailToExistingUser = async (
	user: HydratedDocument<UserType, UserMethods>,
	schoolName: string,
) => {
	const { firstName, lastName, middleName, email } = user;
	const html = `
      <div>
				<h1>Приглашение в школу</h1>
				<p>Добрый день, ${firstName} ${lastName} ${middleName}!</p>
				<p>Вас приглашают в учреждение: <b>${schoolName}</b></p>
			<hr>
				<p>Для начала работы используйте следующие данные для входа:</p>
				<p>Пожалуйста, войдите в систему и смените пароль на постоянный. Это поможет обеспечить безопасность вашего аккаунта.</p>
				<p>Если пароль не будет изменен в течение 24 часов, аккаунт будет временно заблокирован. В таком случае свяжитесь с администратором для восстановления доступа.</p>
				<p>Если у вас возникнут вопросы, обращайтесь к нам. Желаем успешной работы!</p>
			</div>
    `;
	try {
		await transporter.sendMail({
			from: `"Школьная система" <${process.env.SMTP_USER}>`,
			to: email,
			subject: 'Приглашение в систему школы',
			html,
		});
	} catch (e) {
		throw new Error('Не удалось отправить письмо');
	}
};

export const sendAssignmentNotification = async (
	userData: Pick<UserType, 'firstName' | 'lastName' | 'middleName' | 'email'>,
	schoolName: string,
	position: string,
) => {};

export const sendSuspensionNotice = async (email: string) => {};
