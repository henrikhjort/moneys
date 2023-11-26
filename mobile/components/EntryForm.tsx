import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, Animated, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SvgXml } from 'react-native-svg';

import type Category from '../types/Category';

import murmelLegsXml from '../assets/murmelLegs';
import murmelLegsFat1Xml from '../assets/murmelLegsFat1';
import murmelLegsFat2Xml from '../assets/murmelLegsFat2';
import murmelLegsFat3Xml from '../assets/murmelLegsFat3';
import murmelLegsFat4Xml from '../assets/murmelLegsFat4';
import murmelHandsXml from '../assets/murmelHands';
import Murmel from './Murmel';
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
  const { userId, entries, setEntries, eurosSpentToday } = useAppContext();
  const [amount, setAmount] = useState<number | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [isMurmelAngry, setIsMurmelAngry] = useState(false);
  const [isMurmelHappy, setIsMurmelHappy] = useState(false);
  const [isMurmelGreedy, setIsMurmelGreedy] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buttonTitle, setButtonTitle] = useState(t('submit'));

  const amountInputAnim = useRef(new Animated.Value(0)).current;
  const categoryInputAnim = useRef(new Animated.Value(0)).current;

  const shakeAnimation = (animatedValue: Animated.Value) => {
    Animated.sequence([
      Animated.timing(animatedValue, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  };

  useEffect(() => {
    if (amount) {
      setIsMurmelGreedy(true);
      const timeout = setTimeout(() => {
        setIsMurmelGreedy(false);
      }, 300);
    }
  }, [amount]);

  useEffect(() => {
    if (isMurmelAngry) {
      const timeout = setTimeout(() => {
        setIsMurmelAngry(false);
      }, 2000);
    }
  }, [isMurmelAngry]);

  useEffect(() => {
    if (isMurmelHappy) {
      const timeout = setTimeout(() => {
        setIsMurmelHappy(false);
      }, 1000);
    }
  }, [isMurmelHappy]);

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (!amount) {
      shakeAnimation(amountInputAnim);
    }
    if (!category) {
      shakeAnimation(categoryInputAnim);
    }
    if (!amount || !category) {
      setIsMurmelAngry(true);
      return;
    }
    const data = {
      amount: amount,
      category: category,
      createdAt: new Date().toUTCString(),
    };
    try {
      setIsLoading(true);
      const createdEntry = await createEntry(data, userId);
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
      setIsMurmelHappy(true);
      setButtonStyle(styles.success);
      setButtonTitle(t('submitSuccess'));
      setTimeout(() => {
        setButtonStyle({})
        setButtonTitle(t('submit'));
      }, 1000);
    } catch (error) {
      setButtonStyle(styles.error);
      setButtonTitle(t('submitFail'));
      setTimeout(() => {
        setButtonStyle({})
        setButtonTitle(t('submit'));
      }, 1000);
    }
    finally {
      setIsLoading(false);
    }
  };

  const renderLegs = () => {
    if (eurosSpentToday < 20) {
      return <SvgXml xml={murmelLegsXml} width="150" height="400"/>
    }
    if (eurosSpentToday < 50) {
      return <SvgXml xml={murmelLegsFat1Xml} width="150" height="400"/>
    }
    if (eurosSpentToday < 100) {
      return <SvgXml xml={murmelLegsFat2Xml} width="150" height="400"/>
    }
    if (eurosSpentToday < 150) {
      return <SvgXml xml={murmelLegsFat3Xml} width="150" height="400"/>
    }
    return <SvgXml xml={murmelLegsFat4Xml} width="150" height="400"/>
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Murmel angry={isMurmelAngry} happy={isMurmelHappy} greedy={isMurmelGreedy} />
        <Animated.View style={[{ transform: [{ translateX: amountInputAnim }] }, styles.animatedContainer]}>
          <NumberInput label={`${t('amount')} €`} amount={amount} setAmount={setAmount} disabled={isLoading} />
        </Animated.View>
        <View style={styles.handsContainer}>
          {!isModalOpen && <SvgXml xml={murmelHandsXml} width="200" height="100" />}
        </View>
        <Animated.View style={[{ transform: [{ translateX: categoryInputAnim }] }, styles.animatedContainer]}>
          <CategoryPicker 
            label={t('category')}
            selectedValue={category}
            onValueChange={setCategory}
            disabled={isLoading}
            setIsModalOpen={setIsModalOpen}
          />
        </Animated.View>
        <Button title={buttonTitle} onPress={handleSubmit} style={buttonStyle} isLoading={isLoading} />
        <View style={styles.murmelLegs}>
          {renderLegs()}
        </View>
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
    marginTop: 20,
  },
  animatedContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  success: {
    backgroundColor: '#2f7332',
  },
  error: {
    backgroundColor: '#D32F2F',
  },
  murmelLegs: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handsContainer: {
    position: 'absolute',
    paddingBottom: 20,
  },
});

export default EntryForm;
