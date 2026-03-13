export const generateOTP = () =>
	crypto.randomUUID().replace(/-/g, '').slice(0, 8);
