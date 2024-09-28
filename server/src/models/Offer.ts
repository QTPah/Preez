import mongoose, { Schema, Document } from 'mongoose';

interface IOffer extends Document {
  title: string;
  description: string;
  price: number;
  category: string;
  user: mongoose.Types.ObjectId;
  status: string;
  tags: string[];
}

const offerSchema: Schema = new Schema({
