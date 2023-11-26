import mongoose from 'mongoose';

// Define the schema for entries
const entrySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
});

// Create a Mongoose model
const CustomCategoryModel = mongoose.model('CustomCategory', entrySchema);

export default CustomCategoryModel;
