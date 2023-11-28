import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Screen } from '../types/Screen';

import { useAppContext } from '../context/AppContext';
import { useThemeContext } from '../context/ThemeContext';
import { white, secondaryWhite, black, secondaryBlack, purple, secondaryPurple } from '../styles/colors';

const DataSelector = () => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const { dataView, setDataView } = useAppContext();
  return (
    <View style={styles.tabsContainer}>
      <TouchableOpacity 
        style={[styles.tab, dataView === 'list' && styles.activeTab]}
        onPress={() => setDataView('list')}
      >
        <Text style={[
          styles.tabText, 
          dataView === 'graph' && styles.activeTabText
          ]}
        >
          {t('listView')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, dataView === 'graph' && styles.activeTab]}
        onPress={() => setDataView('graph')}
      >
        <Text style={[
          styles.tabText, 
          dataView === 'graph' && styles.activeTabText
          ]}
        >
          {t('graphView')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (theme: string | null) => StyleSheet.create({
  tabsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: theme === 'light' ? white : black,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderBottomColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    backgroundColor: theme === 'light' ? white : black,
    borderColor: theme === 'light' ? black : white,
  },
  activeTab: {
    borderBottomColor: theme === 'light' ? black : purple,
    borderBottomWidth: 3,
  },
  tabText: {
    textAlign: 'center',
    color: theme === 'light' ? black : white,
    fontSize: 16,
    fontVariant: ['small-caps'],
  },
  activeTabText: {
    color: theme === 'light' ? black : white,
  },
});

export default DataSelector;
