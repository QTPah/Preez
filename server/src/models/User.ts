import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

const userSchema: Schema = new Schema({
