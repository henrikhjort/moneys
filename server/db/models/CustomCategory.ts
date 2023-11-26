import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  category: { type: String, required: true },
});

const CustomCategoryModel = mongoose.model('CustomCategory', entrySchema);

export default CustomCategoryModel;
