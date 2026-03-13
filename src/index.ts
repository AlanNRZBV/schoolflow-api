import 'dotenv/config'
import dotenv from 'dotenv';
import config from '@/config/config';
import express, { Express } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import usersRouter from '@/routes/user';
import authRouter from '@/routes/auth';
import schoolRouter from '@/routes/school';
import { errors } from 'celebrate';
import { errorHandler } from '@/middleware/error-handler';
import authMiddleware from '@/middleware/auth';

dotenv.config();
const app: Express = express();
// mongoose.set('debug', true);

app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRouter);
app.use(authMiddleware);
app.use('/users', usersRouter);
app.use('/schools', schoolRouter);
app.use(errors());
app.use(errorHandler);

const run = async () => {
	const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_CLUSTER } = process.env;

	if (!MONGO_USERNAME || !MONGO_PASSWORD || !MONGO_CLUSTER) {
		throw new Error('Missing Mongo env vars');
	}

	const username = encodeURIComponent(MONGO_USERNAME as string);
	const password = encodeURIComponent(MONGO_PASSWORD as string);
	const cluster = encodeURIComponent(MONGO_CLUSTER as string);

	let uri = `mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority&appName=schoolflow&authSource=admin`;

	try {
		await mongoose.connect(uri, { dbName: 'schoolflow' });
		console.log('MongoDB connected');
	} catch (error) {
		console.error('MongoDB connection error:', error);
	}

	app.listen(config.port, () => {
		console.log(`Server running on port ${config.port}`);
	});
};

void run();
