import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Screen } from '../types/Screen';

import { useAppContext } from '../context/AppContext';
import { useThemeContext } from '../context/ThemeContext';
import { white, secondaryWhite, black, secondaryBlack, purple, secondaryPurple } from '../styles/colors';

const TabSelector = () => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const { currentScreen, setCurrentScreen } = useAppContext();
  return (
    <View style={styles.tabsContainer}>
      <TouchableOpacity 
        style={[styles.tab, currentScreen === Screen.INPUT && styles.activeTab]}
        onPress={() => setCurrentScreen(Screen.INPUT)}
      >
        <Text style={[
          styles.tabText, 
          currentScreen === Screen.INPUT && styles.activeTabText
          ]}>{t('input')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, currentScreen === Screen.VIEW && styles.activeTab]}
        onPress={() => setCurrentScreen(Screen.VIEW)}
      >
        <Text style={[
          styles.tabText, 
          currentScreen === Screen.VIEW && styles.activeTabText
          ]}>{t('list')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (theme: string) => StyleSheet.create({
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
    color: theme === 'light' ? '#121212' : 'white',
    fontSize: 16,
    fontVariant: ['small-caps'],
  },
  activeTabText: {
    color: theme === 'light' ? '#121212' : 'white',
  },
});

export default TabSelector;
