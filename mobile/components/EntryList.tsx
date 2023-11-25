import React, { useState } from 'react';
import { ScrollView, Text, View, StyleSheet, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';

import ViewPeriodSelector from './ViewPeriodSelector';
import Summary from './Summary';
import EntryListItem from './EntryListItem';
import MurmelFromBelow from './MurmelFromBelow';

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
          <EntryListItem key={index} entry={entry} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    zIndex: 999,
  },
  dataContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  dataText: {
    marginBottom: 5,
  },
  deleteContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  deleteButton: {
    paddingVertical: 10,
    paddingRight: 20,
  },
});

export default EntryList;
