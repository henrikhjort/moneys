import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { RecurringEntry } from '../types/RecurringEntry';

import { formatToHelsinkiTime } from '../utils/helpers';
import { useUserContext } from '../context/UserContext';
import { useThemeContext } from '../context/ThemeContext';
import { white, black, secondaryWhite, gray, placeholder, purple } from '../styles/colors';

type CategoryListItemProps = {
  recurringEntry: RecurringEntry;
}

const RecurringEntryListItem = ({ recurringEntry }: CategoryListItemProps) => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const { userId, removeRecurringEntry } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteRecurring = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      removeRecurringEntry(recurringEntry._id);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.itemContainer}>
      <View style={styles.dataContainer}>
        <Text style={styles.listItemText}>{recurringEntry.category}</Text>
        <Text style={styles.listItemText}>{recurringEntry.amount} €</Text>
        <Text style={styles.listItemText}>{t(recurringEntry.interval)}</Text>
        <Text style={[styles.listItemText, styles.grayText]}>{t('next_due_date')}</Text>
        <Text style={styles.listItemText}>{formatToHelsinkiTime(recurringEntry.nextDueDate)}</Text>
      </View>
      <View style={styles.deleteContainer}>
        <TouchableOpacity onPress={handleDeleteRecurring} style={styles.deleteButton}>
          {isLoading ? <ActivityIndicator size="small" color="#C7C7CD" /> : <Text>❌</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (theme: string | null) => StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme === 'light' ? black : white,
    alignItems: 'center',
  },
  listItemText: {
    color: theme === 'light' ? black : white,
    fontSize: 16,
  },
  grayText: {
    color: theme === 'light' ? gray : secondaryWhite,
  },
  dataContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  deleteContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingRight: 10,
  },
  deleteButton: {
    padding: 0,
  },
});

export default RecurringEntryListItem;
