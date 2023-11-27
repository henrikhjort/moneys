import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';

import postTheme from '../api/postTheme';
import { useThemeContext } from '../context/ThemeContext';
import { white, secondaryWhite, black, secondaryBlack } from '../styles/colors';
import { useUserContext } from '../context/UserContext';

const ThemeSwitcher = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useThemeContext();
  const { userId } = useUserContext();
  const styles = getStyles(theme);

  const text = theme === 'light' ? t('dark_mode') : t('light_mode');

  const handleToggle = async () => {
    toggleTheme();
    const newTheme = theme === 'light' ? 'dark' : 'light';
    if (userId) {
      try {
        await postTheme(newTheme, userId);
      } catch (error) {
        return;
      }
    }
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
      onPress={handleToggle}
    >
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

const getStyles = (theme: string | null) => StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: theme === 'light' ? black : white,
    width: '100%',
  },
  pressed: {
    backgroundColor: theme === 'light' ? secondaryBlack : secondaryWhite,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: theme === 'light' ? 'white' : '#121212',
  },
});


export default ThemeSwitcher;
