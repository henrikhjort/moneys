import React from 'react';
import { Text, StyleSheet, Pressable, StyleProp, ActivityIndicator } from 'react-native';

import { useThemeContext } from '../context/ThemeContext';
import { white, black, secondaryBlack, purple, secondaryPurple } from '../styles/colors';

type ButtonProps = {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  style?: StyleProp<any>;
  isLoading?: boolean;
};

const Button = ({ onPress, title, disabled = false, style, isLoading }: ButtonProps) => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
    >
      <Text style={styles.text}>{isLoading ? <ActivityIndicator size="small" color="#C7C7CD" /> : `${title}`}</Text>
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
    backgroundColor: theme === 'light' ? black : purple,
    width: '100%',
  },
  pressed: {
    backgroundColor: theme === 'light' ? secondaryBlack : secondaryPurple,
  },
  disabled: {
    backgroundColor: '#999',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: theme === 'light' ? white : black,
  },
});


export default Button;
