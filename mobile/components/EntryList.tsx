import React, { useState } from 'react';
import { ScrollView, Text, View, StyleSheet, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';

import ViewPeriodSelector from './ViewPeriodSelector';
import Summary from './Summary';

import { formatToHelsinkiTime, getEmojiForCategory } from '../utils/helpers';
import { useAppContext } from '../context/AppContext';

const EntryList = () => {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const { entries, viewPeriod, fetchEntries, handleDeleteEntry, isLoading } = useAppContext();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    fetchEntries(viewPeriod);
    setRefreshing(false);
  }, [viewPeriod, fetchEntries]);

  return (
    <View>
      <ViewPeriodSelector />
      <Summary />
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {entries.map((entry, index) => (
          <View key={`entry-${index}`} style={styles.itemContainer}>
            <View style={styles.dataContainer}>
              <Text style={styles.dataText}>{formatToHelsinkiTime(entry.createdAt)}</Text>
              <Text style={styles.dataText}>{entry.amount} €</Text>
              <Text style={styles.dataText}>{t(entry.category)} {getEmojiForCategory(entry.category)}</Text>
            </View>
            <View style={styles.deleteContainer}>
              <TouchableOpacity onPress={() => handleDeleteEntry(entry.id || '')} style={styles.deleteButton}>
                {isLoading ? <ActivityIndicator size="small" color="#C7C7CD" /> : <Text>❌</Text>}
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dataContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  dataText: {
    marginBottom: 5,
  },
  deleteContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  deleteButton: {
    paddingVertical: 10,
  },
});

export default EntryList;
