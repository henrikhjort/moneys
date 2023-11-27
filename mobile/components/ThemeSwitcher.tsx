import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useThemeContext } from '../context/ThemeContext';
import { white, secondaryWhite, black, secondaryBlack } from '../styles/colors';

const ThemeSwitcher = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useThemeContext();
  const styles = getStyles(theme);

  const text = theme === 'light' ? t('dark_mode') : t('light_mode');

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
      onPress={toggleTheme}
    >
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

const getStyles = (theme: string) => StyleSheet.create({
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
