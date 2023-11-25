import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';

type NumberInputProps = {
  label?: string;
  amount: number | null;
  setAmount: (amount: number | null) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({ label, amount, setAmount }) => {
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
        style={styles.input}
        keyboardType="numeric"
        value={valueToString(amount)}
        onChangeText={handleChange}
        placeholder={t('amountPlaceholder')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
  },
});

export default NumberInput;
