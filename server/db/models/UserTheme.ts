import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  theme: { type: String, required: true },
});

const UserThemeModel = mongoose.model('UserTheme', entrySchema);

export default UserThemeModel;
