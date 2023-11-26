import mongoose from 'mongoose';
import Category from '../../types/Category';

const CategoryValues = Object.values(Category) as string[];

// Define the schema for entries
const entrySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  createdAt: { type: Date, required: true },
  amount: { type: Number, required: true },
  category: { type: String, enum: CategoryValues, required: true },
  // Add any other fields as needed
});

// Create a Mongoose model
const EntryModel = mongoose.model('Entry', entrySchema);

export default EntryModel;
