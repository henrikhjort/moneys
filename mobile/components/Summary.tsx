import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useAppContext } from '../context/AppContext';
import { useThemeContext } from '../context/ThemeContext';
import { white, black } from '../styles/colors';

const Summary = () => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const { cumulativeAmount, viewPeriod } = useAppContext();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('money_spent')} {t(viewPeriod).toLowerCase()} </Text>
      <Text style={styles.text}>{cumulativeAmount} €</Text>
    </View>
  );
};

const getStyles = (theme: string | null) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    flexWrap: 'wrap',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme === 'light' ? black : white,
  }
});

export default Summary;
