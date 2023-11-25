import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { formatToHelsinkiTime, getEmojiForCategory } from '../utils/helpers';
import { useAppContext } from '../context/AppContext';

const Summary = () => {
  const { t } = useTranslation();
  const { cumulativeAmount, viewPeriod } = useAppContext();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('money_spent')} {t(viewPeriod).toLowerCase()} </Text>
      <Text style={styles.text}>{cumulativeAmount} €</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});

export default Summary;
