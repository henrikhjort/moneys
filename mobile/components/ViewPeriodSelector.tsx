import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import ViewPeriod from '../types/ViewPeriod';

import { useAppContext } from '../context/AppContext';
import { useThemeContext } from '../context/ThemeContext';
import { white, secondaryWhite, black, secondaryBlack, purple, secondaryPurple } from '../styles/colors';

const ViewPeriodSelector = () => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const { viewPeriod, setViewPeriod } = useAppContext();

  const handleSelection = (period: ViewPeriod) => {
    setViewPeriod(period);
  };

  return (
    <View style={styles.tabsContainer}>
      {Object.values(ViewPeriod).map((period) => (
        <TouchableOpacity
          key={period}
          style={[
            styles.tab,
            viewPeriod === period && styles.activeTab
          ]}
          onPress={() => handleSelection(period)}
        >
          <Text style={[
            styles.tabText,
            viewPeriod === period && styles.activeTabText
          ]}>
            {t(period)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const getStyles = (theme: string | null) => StyleSheet.create({
  tabsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: theme === 'light' ? 'black' : white,
  },
  activeTab: {
    borderWidth: 1,
    borderColor: theme === 'light' ? black : purple,
    backgroundColor: theme === 'light' ? black : purple,
  },
  tabText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: theme === 'light' ? black : white,
  },
  activeTabText: {
    color: theme === 'light' ? white : black,
  }
});

export default ViewPeriodSelector;
