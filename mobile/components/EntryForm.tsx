import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';

import type Category from '../types/Category';

import Button from './Button';
import NumberInput from './NumberInput';
import CategoryPicker from './CategoryPicker';
import StatusMessage from './StatusMessage';

import type Status from '../types/Status';
import type { Entry } from '../types/Entry';

import createEntry from '../api/createEntry';
import { sortEntriesByDate } from '../utils/helpers';
import { useAppContext } from '../context/AppContext';

const EntryForm = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<Status | null>(null);
  const [buttonStyle, setButtonStyle] = useState({});
  const { entries, setEntries } = useAppContext();
  const [amount, setAmount] = useState<number | null>(null);
  const [category, setCategory] = useState<Category | null>(null);

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (!amount || !category) {
      return;
    }
    const data = {
      amount: amount,
      category: category,
      createdAt: new Date().toUTCString(),
    };
    try {
      const createdEntry = await createEntry(data);
      const entry: Entry = {
        id: createdEntry._id,
        createdAt: createdEntry.createdAt,
        amount: createdEntry.amount,
        category: createdEntry.category,
      };
      console.log(entry);
      setAmount(null);
      setCategory(null);
      const newEntries = [...entries, entry];
      const sorted = sortEntriesByDate(newEntries);
      setEntries(sorted);
      setButtonStyle(styles.success);
      setTimeout(() => setButtonStyle({}), 1000);
    } catch (error) {
      setButtonStyle(styles.error);
      setTimeout(() => setButtonStyle({}), 1000);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <NumberInput label={`${t('amount')} €`} amount={amount} setAmount={setAmount} />
        <CategoryPicker label={t('category')} selectedValue={category} onValueChange={setCategory} />
        <Button title={t('submit')} onPress={handleSubmit} style={buttonStyle} />
        {status && (
          <StatusMessage status={status} />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 400,
  },
  success: {
    backgroundColor: '#4CAF50',
  },
  error: {
    backgroundColor: '#D32F2F',
  },
});

export default EntryForm;
