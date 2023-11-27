import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Keyboard, Animated, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import Button from './Button';
import CategoryListItem from './CategoryListItem';
import { useUserContext } from '../context/UserContext';
import createCategory from '../api/createCategory';
import getCategories from '../api/getCategories';
import { useThemeContext } from '../context/ThemeContext';
import { white, black, placeholder, error, errorDark, success, successDark } from '../styles/colors';

const CategoryEditor = () => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const { userId, customCategories, setCustomCategories } = useUserContext();
  const [categoryName, setCategoryName] = useState('');
  const [buttonStyle, setButtonStyle] = useState({});
  const [buttonTitle, setButtonTitle] = useState(t('category_add'));

  const categoryInputAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchCategories = async () => {
      if (!userId) return;
      try {
        const categories = await getCategories(userId);
        setCustomCategories(categories);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  },[]);

  const handleSave = async () => {
    if (!userId) return;
    const resetButton = () => {
      setButtonStyle({});
      setButtonTitle(t('category_add'));
    };

    try {
      if (!categoryName) {
        shakeAnimation(categoryInputAnim);
        return;
      }

      const res = await createCategory(categoryName, userId);

      if (res.status === 409) {
        setButtonStyle(styles.error);
        setButtonTitle(t('category_exists'));
        setTimeout(resetButton, 1000);
        return;
      }

      if (res.status === 500) {
        throw new Error('Server error');
      }

      const newCategory = res.category;
      if (!newCategory) {
        throw new Error('No category returned from API');
      }

      Keyboard.dismiss();
      setCustomCategories([...customCategories, newCategory]);
      setButtonStyle(styles.success);
      setButtonTitle(t('category_added'));
      setCategoryName('');
      setTimeout(resetButton, 1000);

    } catch (error) {
      console.error(error);
      setButtonStyle(styles.error);
      setButtonTitle(t('category_add_fail'));
      setCategoryName('');
      setTimeout(resetButton, 1000);
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

  return (
    <View style={styles.container}>
      <Animated.View style={[{ transform: [{ translateX: categoryInputAnim }] }, styles.animatedContainer]}>
        <Text style={styles.label}>{t('category')}</Text>
        <TextInput
          placeholder={t('category_name')}
          style={styles.input}
          value={categoryName}
          onChangeText={setCategoryName}
          placeholderTextColor={placeholder}
        />
      </Animated.View>
      <Button title={buttonTitle} onPress={handleSave} style={buttonStyle} />
      
      <ScrollView style={styles.scrollView}>
        {customCategories.map((category, index) => (
          <CategoryListItem key={index} category={category} />
        ))}
      </ScrollView>
    </View>
  );
};

const getStyles = (theme: string) => StyleSheet.create({
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
    marginTop: 10,
    flex: 1,
    width: '100%',
  },
});

export default CategoryEditor;
