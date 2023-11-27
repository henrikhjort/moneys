import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useThemeContext } from '../context/ThemeContext';

type NumberInputProps = {
  label?: string;
  amount: number | null;
  setAmount: (amount: number | null) => void;
  disabled?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({ label, amount, setAmount, disabled }) => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const handleChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, ''); // Ensures only numbers are entered
    setAmount(valueToNumber(numericValue));
  };

  const valueToString = (value: number | null) => (value === null ? '' : value.toString());

  const valueToNumber = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, ''); // Ensures only numbers are entered
    return numericValue === '' ? null : parseInt(numericValue, 10);
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        editable={!disabled}
        style={[styles.input, disabled && styles.inputDisabled]}
        keyboardType="numeric"
        value={valueToString(amount)}
        onChangeText={handleChange}
        placeholder={t('amountPlaceholder')}
        placeholderTextColor={theme === 'light' ? '#999' : '#CCC'}
      />
    </View>
  );
};

const getStyles = (theme: string) => StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: theme === 'light' ? '#121212' : 'white',
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderColor: theme === 'light' ? 'black' : 'white',
    color: theme === 'light' ? '#121212' : 'white',
    fontSize: 16,
  },
  inputDisabled: {
    color: '#C7C7CD',
  },
});

export default NumberInput;
