import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, Animated, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SvgXml } from 'react-native-svg';

import murmelLegsXml from '../assets/murmelLegs';
import murmelDarkModeLegsXml from '../assets/darkMode/murmelDarkModeLegs';

import murmelLegsFat1Xml from '../assets/murmelLegsFat1';
import darkModeLegsFat1Xml from '../assets/darkMode/darkModeLegsFat1';

import murmelLegsFat2Xml from '../assets/murmelLegsFat2';
import darkModeLegsFat2Xml from '../assets/darkMode/darkModeLegsFat2';

import murmelLegsFat3Xml from '../assets/murmelLegsFat3';
import darkModeLegsFat3Xml from '../assets/darkMode/darkModeLegsFat3';

import murmelLegsFat4Xml from '../assets/murmelLegsFat4';
import darkModeLegsFat4Xml from '../assets/darkMode/darkModeLegsFat4';

import murmelHandsXml from '../assets/murmelHands';
import darkModeHandsXml from '../assets/darkMode/darkModeHands';

import murmelHandsLeftXml from '../assets/murmelHandsLeft';
import darkModeHandsLeftXml from '../assets/darkMode/darkModeHandsLeft';

import murmelHandsRightXml from '../assets/murmelHandsRight';
import darkModeHandsRightXml from '../assets/darkMode/darkModeHandsRight';

import Murmel from './Murmel';
import Button from './Button';
import NumberInput from './NumberInput';
import CategoryPicker from './CategoryPicker';

import type { Entry } from '../types/Entry';

import createEntry from '../api/createEntry';
import { sortEntriesByDate } from '../utils/helpers';
import { useAppContext } from '../context/AppContext';
import { useUserContext } from '../context/UserContext';
import { useThemeContext } from '../context/ThemeContext';
import { error, errorDark, success, successDark } from '../styles/colors';

enum Hands {
  LEFT = 'left',
  RIGHT = 'right',
};

const EntryForm = () => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [buttonStyle, setButtonStyle] = useState({});
  const { entries, setEntries, eurosSpentToday } = useAppContext();
  const { userId, customCategories } = useUserContext();
  const [amount, setAmount] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [isMurmelAngry, setIsMurmelAngry] = useState(false);
  const [isMurmelHappy, setIsMurmelHappy] = useState(false);
  const [isMurmelGreedy, setIsMurmelGreedy] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buttonTitle, setButtonTitle] = useState(t('submit'));
  const [hands, setHands] = useState<Hands>(Hands.LEFT);
  const [isScrolling, setIsScrolling] = useState(false);

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
    setCategory(null);
  }, [customCategories]);

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
    const hasMultipleDecimals = amount && amount.split(',').length > 2;
    if (!amount || hasMultipleDecimals) {
      setIsMurmelAngry(true);
      shakeAnimation(amountInputAnim);
      return;
    }
    if (!amount) {
      shakeAnimation(amountInputAnim);
    }
    if (!category) {
      shakeAnimation(categoryInputAnim);
    }
    if (!amount || !category || hasMultipleDecimals) {
      setIsMurmelAngry(true);
      return;
    }
    try {
      const data = {
        amount: parseFloat(amount.replace(',', '.')),
        category: category,
        createdAt: new Date().toISOString(),
      };
      if (!userId) return;
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

  const renderLightModeLegs = () => {
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

  const renderDarkModeLegs = () => {
    if (eurosSpentToday < 20) {
      return <SvgXml xml={murmelDarkModeLegsXml} width="150" height="400"/>
    }
    if (eurosSpentToday < 50) {
      return <SvgXml xml={darkModeLegsFat1Xml} width="150" height="400"/>
    }
    if (eurosSpentToday < 100) {
      return <SvgXml xml={darkModeLegsFat2Xml} width="150" height="400"/>
    }
    if (eurosSpentToday < 150) {
      return <SvgXml xml={darkModeLegsFat3Xml} width="150" height="400"/>
    }
    return <SvgXml xml={darkModeLegsFat4Xml} width="150" height="400"/>
  }

  const renderLegs = () => {
    if (theme === 'light') {
      return renderLightModeLegs();
    }
    else {
      return renderDarkModeLegs();
    }
  }

  useEffect(() => {
    let intervalId: any;

    if (isModalOpen) {
      intervalId = setInterval(() => {
        setHands(prevHands => {
          if (prevHands === Hands.LEFT) return Hands.RIGHT;
          if (prevHands === Hands.RIGHT) return Hands.LEFT;
          return Hands.LEFT;
        });
      }, 100);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isModalOpen]);

  const renderLightModeHands = () => {
    switch (hands) {
      case Hands.LEFT:
        return <SvgXml xml={murmelHandsLeftXml} width="200" height="150" />;
      case Hands.RIGHT:
        return <SvgXml xml={murmelHandsRightXml} width="200" height="150" />;
      default:
        return <SvgXml xml={murmelHandsXml} width="200" height="150" />;
    }
  }

  const renderDarkModeHands = () => {
    switch (hands) {
      case Hands.LEFT:
        return <SvgXml xml={darkModeHandsLeftXml} width="200" height="150" />;
      case Hands.RIGHT:
        return <SvgXml xml={darkModeHandsRightXml} width="200" height="150" />;
      default:
        return <SvgXml xml={darkModeHandsXml} width="200" height="150" />;
    }
  }

  const renderHands = () => {
    if (theme === 'light') {
      if (isModalOpen) {
        if (isScrolling) {
          return renderLightModeHands();
        } else return <SvgXml xml={murmelHandsXml} width="200" height="100" />
      } else {
        return <SvgXml xml={murmelHandsXml} width="200" height="100" />
      }
    }
    else {
      if (isModalOpen) {  
        return renderDarkModeHands();
      } else {
        return <SvgXml xml={darkModeHandsXml} width="200" height="100" />
      }
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Murmel angry={isMurmelAngry} happy={isMurmelHappy} greedy={isMurmelGreedy} />
        <Animated.View style={[{ transform: [{ translateX: amountInputAnim }] }, styles.animatedContainer]}>
          <NumberInput label={`${t('amount')} €`} amount={amount} setAmount={setAmount} disabled={isLoading} />
        </Animated.View>
        <View style={styles.handsContainer}>
          {renderHands()}
        </View>
        <Animated.View style={[{ transform: [{ translateX: categoryInputAnim }] }, styles.animatedContainer]}>
          <CategoryPicker 
            label={t('category')}
            selectedValue={category}
            onValueChange={setCategory}
            disabled={isLoading}
            setIsModalOpen={setIsModalOpen}
            setIsScrolling={setIsScrolling}
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

const getStyles = (theme: string | null) => StyleSheet.create({
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
    backgroundColor: theme === 'light' ? success : successDark,
  },
  error: {
    backgroundColor: theme === 'light' ? error : errorDark,
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
