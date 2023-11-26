import React from 'react';
import { Text, StyleSheet, Pressable, StyleProp, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useThemeContext } from '../context/ThemeContext';

const ThemeSwitcher = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useThemeContext();
  const styles = getStyles(theme);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
      onPress={toggleTheme}
    >
      <Text style={styles.text}>{t('menu_theme')}</Text>
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
    backgroundColor: theme === 'light' ? '#121212' : 'white',
    width: '100%',
  },
  pressed: {
    backgroundColor: '#333',
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
