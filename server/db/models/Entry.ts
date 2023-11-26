import mongoose from 'mongoose';

// Define the schema for entries
const entrySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  createdAt: { type: Date, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
});

// Create a Mongoose model
const EntryModel = mongoose.model('Entry', entrySchema);

export default EntryModel;
