import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';

import type Category from '../types/Category';

import Button from './Button';
import NumberInput from './NumberInput';
import CategoryPicker from './CategoryPicker';

import createEntry from '../api/createEntry';
import { sortEntriesByDate } from '../utils/helpers';
import { useAppContext } from '../context/AppContext';

const EntryForm = () => {
  const { t } = useTranslation();
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
      setAmount(null);
      setCategory(null);
      const newEntries = [...entries, createdEntry];
      const sorted = sortEntriesByDate(newEntries);
      setEntries(sorted);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <NumberInput label={`${t('amount')} €`} amount={amount} setAmount={setAmount} />
        <CategoryPicker label={t('category')} selectedValue={category} onValueChange={setCategory} />
        <Button title={t('submit')} onPress={handleSubmit} />
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
});

export default EntryForm;
