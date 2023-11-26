import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Screen } from '../types/Screen';

import { useAppContext } from '../context/AppContext';
import { useThemeContext } from '../context/ThemeContext';

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
    marginBottom: 16,
    backgroundColor: theme === 'light' ? 'white' : '#121212',
  },
  tab: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: theme === 'light' ? 'white' : '#121212',
    borderColor: theme === 'light' ? 'black' : 'white',
  },
  activeTab: {
    backgroundColor: theme === 'light' ? 'black' : 'white',
  },
  tabText: {
    textAlign: 'center',
    color: theme === 'light' ? '#121212' : 'white', // Default color for both themes
  },
  activeTabText: {
    color: theme === 'light' ? 'white' : '#121212', // Color for active tab text
  },
});

export default TabSelector;
