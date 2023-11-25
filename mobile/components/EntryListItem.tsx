import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { formatToHelsinkiTime, getEmojiForCategory } from '../utils/helpers';
import { useAppContext } from '../context/AppContext';

import type { Entry } from '../types/Entry';

type EntryListItemProps = {
  entry: Entry;
}

const EntryListItem = ({ entry }: EntryListItemProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { handleDeleteEntry } = useAppContext();

  const deleteEntry = async (id: string) => {
    setIsLoading(true);
    await handleDeleteEntry(id);
    setIsLoading(false);
  }

  return (
    <View style={styles.itemContainer}>
      <View style={styles.dataContainer}>
        <Text style={styles.dataText}>{formatToHelsinkiTime(entry.createdAt)}</Text>
        <Text style={styles.dataText}>{entry.amount} €</Text>
        <Text style={styles.dataText}>{t(entry.category)} {getEmojiForCategory(entry.category)}</Text>
      </View>
      <View style={styles.deleteContainer}>
        <TouchableOpacity onPress={() => deleteEntry(entry.id || '')} style={styles.deleteButton}>
          {isLoading ? <ActivityIndicator size="small" color="#C7C7CD" /> : <Text>❌</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dataContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  dataText: {
    marginBottom: 5,
  },
  deleteContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    padding: 10,
  },
});

export default EntryListItem;
