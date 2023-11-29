import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Keyboard, Animated, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { RecurringEntryInput } from '../types/RecurringEntry';

import Button from './Button';
import NumberInput from './NumberInput';
import ScrollPicker from './ScrollPicker';
import RecurringEntryListItem from './RecurringEntryListItem';
import { useUserContext } from '../context/UserContext';
import { useThemeContext } from '../context/ThemeContext';
import { white, secondaryWhite, black, secondaryBlack, placeholder, error, errorDark, success, successDark } from '../styles/colors';

const RecurringExpenseEditor = () => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const { userId, recurringEntries, saveRecurringEntry, setRecurringEntries } = useUserContext();
  const [buttonStyle, setButtonStyle] = useState({});
  const [buttonTitle, setButtonTitle] = useState(t('category_add'));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [categoryName, setCategoryName] = useState('');
  const [amount, setAmount] = useState<string | null>(null);
  const [interval, setInterval] = useState<string | null>(null);

  const isPlaceholder = interval === null;

  const amountInputAnim = useRef(new Animated.Value(0)).current;
  const categoryInputAnim = useRef(new Animated.Value(0)).current;
  const intervalInputAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchRecurringExpenses = async () => {
      if (!userId) return;
      try {
        //
      } catch (error) {
        console.error(error);
      }
    };
    fetchRecurringExpenses();
  },[userId]);

  const handleSave = async () => {
    Keyboard.dismiss();
    if (!categoryName) {
      shakeAnimation(categoryInputAnim);
    }
    const hasMultipleDecimals = amount && amount.split(',').length > 2;
    if (!amount || hasMultipleDecimals) {
      shakeAnimation(amountInputAnim);
      return;
    }
    if (!interval) {
      shakeAnimation(intervalInputAnim);
      return;
    }
    try {
      const data: RecurringEntryInput = {
        category: categoryName,
        amount: parseFloat(amount),
        interval: interval as 'daily' | 'weekly' | 'monthly' | 'yearly',
        effectiveImmediately: false,
      };
      const res = await saveRecurringEntry(data);
      setCategoryName('');
      setAmount(null);
      setInterval(null);
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
  };

  const shakeAnimation = (animatedValue: Animated.Value) => {
    Animated.sequence([
      Animated.timing(animatedValue, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  };

  const intervalText = () => {
    if (interval === null) return t('interval_placeholder');
    return t(interval);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[{ transform: [{ translateX: categoryInputAnim }] }, styles.animatedContainer]}>
        <Text style={styles.label}>{t('recurring_category')}</Text>
        <TextInput
          placeholder={t('recurring_category_placeholder')}
          style={styles.input}
          value={categoryName}
          onChangeText={setCategoryName}
          placeholderTextColor={placeholder}
          maxLength={25}
        />
      </Animated.View>
      <Animated.View style={[{ transform: [{ translateX: amountInputAnim }] }, styles.animatedContainer]}>
        <NumberInput label={t('recurring_amount')} amount={amount} setAmount={setAmount} />
      </Animated.View>
      <Animated.View style={[{ transform: [{ translateX: amountInputAnim }] }, styles.animatedContainer]}>
        <Text style={styles.label}>{t('recurring_interval')}</Text>
        <TouchableOpacity style={styles.touchable} onPress={() => {
          Keyboard.dismiss();
          setIsModalOpen(true);
        }}>
          <Text style={isPlaceholder ? styles.placeholderText : styles.touchableText}>
            {intervalText()}
          </Text>
        </TouchableOpacity>
      </Animated.View>
      <Modal
        visible={isModalOpen}
        transparent
        animationType="none"
        onRequestClose={() => closeModal()}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => closeModal()}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <ScrollPicker
              data={["daily", "weekly", "monthly", "yearly"]}
              handleClose={closeModal}
              onValueChange={setInterval}
              selectedValue={interval}
              setIsScrolling={() => {}}
            />
          </View>
        </View>
      </Modal>
      <Button title={buttonTitle} onPress={handleSave} style={buttonStyle} />
      <ScrollView indicatorStyle={theme === 'light' ? 'black' : 'white'} style={styles.scrollView}>
        {recurringEntries.map((recurringEntry, index) => (
          <RecurringEntryListItem key={index} recurringEntry={recurringEntry} />
        ))}
      </ScrollView>
    </View>
  );
};

const getStyles = (theme: string | null) => StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: theme === 'light' ? black : white,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    marginBottom: 8,
    color: theme === 'light' ? black : white,
    borderColor: theme === 'light' ? black : white,
  },
  success: {
    backgroundColor: theme === 'light' ? success : successDark,
  },
  error: {
    backgroundColor: theme === 'light' ? error : errorDark,
  },
  animatedContainer: {
    zIndex: 1,
  },
  scrollView: {
    marginTop: 20,
    flex: 1,
    width: '100%',
  },
  touchable: {
    height: 40,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
    borderColor: theme === 'light' ? black : white,
  },
  placeholderText: {
    fontSize: 16,
    color: placeholder,
  },
  touchableText: {
    fontSize: 18,
    color: theme === 'light' ? black : white,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme === 'light' ? 'rgba(0, 0, 0, .3)' : 'rgba(0, 0, 0, 0.5)',
    zIndex: 9,
  },
  modalContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 160,
    backgroundColor: theme === 'light' ? white : secondaryBlack,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 16,
    color: theme === 'light' ? black : white,
    fontWeight: 'bold',
  },
});

export default RecurringExpenseEditor;
