import express, { Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import type { Entry } from './types/Entry';
import EntryModel from './db/models/Entry';
import CustomCategoryModel from './db/models/CustomCategory';

import validateEntry from './utils/validateEntry';
import { getStartOfTodayUTC, getEndOfTodayUTC, getStartOfWeekUTC, getStartOfMonthUTC } from './utils/time';

dotenv.config();

const mongoString = process.env.MONGO_CONNECTION_STRING || '';

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
});

database.once('connected', () => {
    console.log('Database Connected');
});

const getUserIdFromHeaders = (req: Request): string | null => {
  return req.headers['x-user-id'] as string || null;
};


const app: Application = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('hello :D');
});

app.post('/api/entries', async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const expectedApiKey = process.env.API_KEY;

  if (!authHeader) {
    res.status(401).json({ message: 'No authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (token !== expectedApiKey) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const userId = getUserIdFromHeaders(req);
  if (!userId) {
    res.status(400).json({ message: 'No user ID provided' });
    return;
  }

  const entry: Entry = { ...req.body, userId };

  // Validate data.
  const isValidEntry = validateEntry(entry);
  if (!isValidEntry) {
    res.status(400).json({ message: 'Invalid entry' });
    return;
  }
  const data = new EntryModel(entry);

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({message: error});
  }
});

app.delete('/api/entries/:id', async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const expectedApiKey = process.env.API_KEY;

  if (!authHeader) {
    res.status(401).json({ message: 'No authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (token !== expectedApiKey) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const userId = getUserIdFromHeaders(req);
  if (!userId) {
    res.status(400).json({ message: 'No user ID provided' });
    return;
  }

  const entryId = req.params.id;

  try {
    const entryToDelete = await EntryModel.findOne({ _id: entryId, userId });
    if (!entryToDelete) {
      res.status(404).json({ message: 'Entry not found or does not belong to the user' });
      return;
    }
    const deletedEntry = await EntryModel.findByIdAndDelete(entryToDelete._id);
    if (!deletedEntry) {
      res.status(404).json({ message: 'Entry not found' });
    } else {
      res.status(200).json({ message: 'Entry deleted', entry: deletedEntry });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting entry', error: error });
  }
});


app.get('/api/entries/today', async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const expectedApiKey = process.env.API_KEY;

  if (!authHeader) {
    res.status(401).json({ message: 'No authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (token !== expectedApiKey) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const userId = getUserIdFromHeaders(req);
  if (!userId) {
    res.status(400).json({ message: 'No user ID provided' });
    return;
  }

  try {
    const startStr = getStartOfTodayUTC();
    const endStr = getEndOfTodayUTC();

    const entries = await EntryModel.find({
      userId,
      createdAt: {
        $gte: startStr,
        $lte: endStr
      }
    }).sort({ createdAt: -1 });

    res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving data', error: error });
  }
});

app.get('/api/entries/this_week', async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const expectedApiKey = process.env.API_KEY;

  if (!authHeader) {
    res.status(401).json({ message: 'No authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (token !== expectedApiKey) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const userId = getUserIdFromHeaders(req);
  if (!userId) {
    res.status(400).json({ message: 'No user ID provided' });
    return;
  }

  try {
    const startOfWeekStr = getStartOfWeekUTC();
    const nowStr = new Date().toISOString();

    const entries = await EntryModel.find({
      userId,
      createdAt: {
        $gte: startOfWeekStr,
        $lte: nowStr
      }
    }).sort({ createdAt: -1 });

    res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving data', error: error });
  }
});

app.get('/api/entries/this_month', async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const expectedApiKey = process.env.API_KEY;

  if (!authHeader) {
    res.status(401).json({ message: 'No authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (token !== expectedApiKey) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const userId = getUserIdFromHeaders(req);
  if (!userId) {
    res.status(400).json({ message: 'No user ID provided' });
    return;
  }

  try {
    const startOfMonthStr = getStartOfMonthUTC();
    const nowStr = new Date().toISOString();

    const entries = await EntryModel.find({
      userId,
      createdAt: {
        $gte: startOfMonthStr,
        $lte: nowStr
      }
    }).sort({ createdAt: -1 });

    res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving data', error: error });
  }
});

app.get('/api/categories', async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const expectedApiKey = process.env.API_KEY;

  if (!authHeader) {
    res.status(401).json({ message: 'No authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (token !== expectedApiKey) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const userId = getUserIdFromHeaders(req);
  if (!userId) {
    res.status(400).json({ message: 'No user ID provided' });
    return;
  }

  try {
    // Get user categories from db.
    const categoryObjects = await CustomCategoryModel.find({userId,});
    const categories = categoryObjects.map((categoryObject) => categoryObject.category);
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving data', error: error });
  }
});

app.post('/api/categories', async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const expectedApiKey = process.env.API_KEY;

  if (!authHeader) {
    res.status(401).json({ message: 'No authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (token !== expectedApiKey) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const userId = getUserIdFromHeaders(req);
  if (!userId) {
    res.status(400).json({ message: 'No user ID provided' });
    return;
  }

  const category = req.body.category;
  try {
    const existingCategory = await CustomCategoryModel.findOne({ userId, category });
    if (existingCategory) {
      res.status(409).json({ message: 'Category already exists' }); // 409 Conflict
      return;
    }

    const data = new CustomCategoryModel({ category, userId });
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);

  } catch (error) {
    res.status(400).json({ message: error });
  }
});

app.delete('/api/categories/:category', async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const expectedApiKey = process.env.API_KEY;

  if (!authHeader) {
    res.status(401).json({ message: 'No authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (token !== expectedApiKey) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const userId = getUserIdFromHeaders(req);
  if (!userId) {
    res.status(400).json({ message: 'No user ID provided' });
    return;
  }

  const category = req.params.category;

  try {
    const categoryToDelete = await CustomCategoryModel.findOne({ category: category, userId });
    if (!categoryToDelete) {
      res.status(404).json({ message: 'Category not found or does not belong to the user' });
      return;
    }
    const deletedCategory = await CustomCategoryModel.findOneAndDelete({ category: categoryToDelete.category, userId });
    if (!deletedCategory) {
      res.status(404).json({ message: 'Entry not found' });
    } else {
      res.status(200).json({ message: 'Entry deleted', category: deletedCategory.category });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting entry', error: error });
  }
});

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
