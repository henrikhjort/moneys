import express, { Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import type { Entry } from './types/Entry';
import EntryModel from './db/models/Entry';

import validateEntry from './utils/validateEntry';
import { getStartOfTodayUTC, getEndOfTodayUTC, getStartOfWeekUTC, getStartOfMonthUTC } from './utils/time';

dotenv.config();

const mongoString = process.env.MONGO_CONNECTION_STRING || '';
const API_KEY = process.env.API_KEY;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

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
  const entry: Entry = req.body;

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

  const entryId = req.params.id;

  try {
    const deletedEntry = await EntryModel.findByIdAndDelete(entryId);
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
  try {
    const startStr = getStartOfTodayUTC();
    const endStr = getEndOfTodayUTC();

    const entries = await EntryModel.find({
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
  try {
    const startOfWeekStr = getStartOfWeekUTC();
    const nowStr = new Date().toISOString();

    const entries = await EntryModel.find({
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
  try {
    const startOfMonthStr = getStartOfMonthUTC();
    const nowStr = new Date().toISOString();

    const entries = await EntryModel.find({
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


app.listen(8000, '0.0.0.0', () => {
  console.log(`Server is Fire at http://localhost:8000`);
});