import { Student, StudentModel } from '@/models/user/student/students.types';
import { Schema } from 'mongoose';

export const studentSchema = new Schema<Student, StudentModel>({});
