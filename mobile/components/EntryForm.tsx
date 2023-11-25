import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, Animated, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SvgXml } from 'react-native-svg';

import type Category from '../types/Category';

import murmelXml from '../assets/murmel';
import murmelHappyXml from '../assets/murmel2';
import Button from './Button';
import NumberInput from './NumberInput';
import CategoryPicker from './CategoryPicker';

import type { Entry } from '../types/Entry';

import createEntry from '../api/createEntry';
import { sortEntriesByDate } from '../utils/helpers';
import { useAppContext } from '../context/AppContext';

const EntryForm = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [buttonStyle, setButtonStyle] = useState({});
  const { entries, setEntries } = useAppContext();
  const [amount, setAmount] = useState<number | null>(null);
  const [category, setCategory] = useState<Category | null>(null);

  const amountInputAnim = new Animated.Value(0);
  const categoryInputAnim = new Animated.Value(0);

  const shakeAnimation = (animatedValue: Animated.Value) => {
    Animated.sequence([
      Animated.timing(animatedValue, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  };


  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (!amount) {
      shakeAnimation(amountInputAnim);
    }
    if (!category) {
      shakeAnimation(categoryInputAnim);
    }
    if (!amount || !category) {
      return;
    }
    const data = {
      amount: amount,
      category: category,
      createdAt: new Date().toUTCString(),
    };
    try {
      setIsLoading(true);
      const createdEntry = await createEntry(data);
      const entry: Entry = {
        id: createdEntry._id,
        createdAt: createdEntry.createdAt,
        amount: createdEntry.amount,
        category: createdEntry.category,
      };
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
    finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <SvgXml xml={murmelXml} width="50%" height="50%"/>
        <Animated.View style={[{ transform: [{ translateX: amountInputAnim }] }, styles.animatedContainer]}>
          <NumberInput label={`${t('amount')} €`} amount={amount} setAmount={setAmount} disabled={isLoading} />
        </Animated.View>
        <Animated.View style={[{ transform: [{ translateX: categoryInputAnim }] }, styles.animatedContainer]}>
          <CategoryPicker label={t('category')} selectedValue={category} onValueChange={setCategory} disabled={isLoading} />
        </Animated.View>
        <Button title={t('submit')} onPress={handleSubmit} style={buttonStyle} isLoading={isLoading} />
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
  animatedContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  success: {
    backgroundColor: '#2f7332',
  },
  error: {
    backgroundColor: '#D32F2F',
  },
});

export default EntryForm;
