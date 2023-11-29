import mongoose from 'mongoose';

const recurringEntrySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  createdAt: { type: Date, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  status: { type: Boolean, required: true},
  nextDueDate: { type: Date, required: true},
  interval: { type: String, required: true},
});

const RecurringEntryModel = mongoose.model('RecurringEntry', recurringEntrySchema);

export default RecurringEntryModel;
