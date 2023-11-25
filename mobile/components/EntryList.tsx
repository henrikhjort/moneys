import React, { useState } from 'react';
import { ScrollView, Text, View, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import ViewPeriodSelector from './ViewPeriodSelector';
import Summary from './Summary';

import { formatToHelsinkiTime, getEmojiForCategory } from '../utils/helpers';
import { useAppContext } from '../context/AppContext';

const EntryList = () => {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const { entries, viewPeriod, fetchEntries, handleDeleteEntry } = useAppContext();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    fetchEntries(viewPeriod);
    setRefreshing(false);
  }, [viewPeriod, fetchEntries]);


  return (
    <View style={styles.container}>
      <ViewPeriodSelector />
      <Summary />
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {entries.map((entry, index) => (
          <View key={`entry-${index}`} style={styles.itemContainer}>
            <Text>{t('date')}: {formatToHelsinkiTime(entry.createdAt)}</Text>
            <Text>{t('amount')}: {entry.amount} €</Text>
            <Text>{t('category')}: {t(entry.category)} {getEmojiForCategory(entry.category)}</Text>
            <TouchableOpacity onPress={() => handleDeleteEntry(entry.id || '')} style={styles.deleteButton}>
              <Text>❌</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  deleteButton: {
    padding: 10,
  },
});

export default EntryList;
