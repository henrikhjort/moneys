import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, RefreshControl } from 'react-native';

import ViewPeriodSelector from './ViewPeriodSelector';
import Summary from './Summary';
import EntryListItem from './EntryListItem';
import DataSelector from './DataSelector';

import { useAppContext } from '../context/AppContext';
import { useThemeContext } from '../context/ThemeContext';

const EntryList = () => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const [refreshing, setRefreshing] = useState(false);
  const { entries, viewPeriod, fetchEntries } = useAppContext();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    fetchEntries(viewPeriod);
    setRefreshing(false);
  }, [viewPeriod, fetchEntries]);

  return (
    <View style={styles.container}>
      <Summary />
      <ViewPeriodSelector />
      <DataSelector />
      <ScrollView
        indicatorStyle={theme === 'light' ? 'black' : 'white'}
        refreshControl={<RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh} 
      />}>
        {entries.map((entry, index) => (
          <EntryListItem key={index} entry={entry} />
        ))}
      </ScrollView>
    </View>
  );
};

const getStyles = (theme: string | null) => StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
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
