import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useThemeContext } from '../context/ThemeContext';
import { white, secondaryWhite, black, secondaryBlack, purple, secondaryPurple, placeholder } from '../styles/colors';

type NumberInputProps = {
  label?: string;
  amount: string | null;
  setAmount: (amount: string | null) => void;
  disabled?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({ label, amount, setAmount, disabled }) => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const { t } = useTranslation();

  const handleChange = (text: string) => {
    setAmount(text);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        editable={!disabled}
        style={[styles.input, disabled && styles.inputDisabled]}
        keyboardType="numeric"
        value={amount?.toString() || ''}
        onChangeText={handleChange}
        placeholder={t('amountPlaceholder')}
        placeholderTextColor={placeholder}
        maxLength={8}
      />
    </View>
  );
};

const getStyles = (theme: string | null) => StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
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
    borderColor: theme === 'light' ? black : white,
    color: theme === 'light' ? black : white,
    fontSize: 16,
  },
  inputDisabled: {
    color: '#C7C7CD',
  },
});

export default NumberInput;
