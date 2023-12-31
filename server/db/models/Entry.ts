import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  createdAt: { type: Date, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  recurring: { type: Boolean, required: false },
});

const EntryModel = mongoose.model('Entry', entrySchema);

export default EntryModel;
