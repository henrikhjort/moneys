import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useTranslation } from 'react-i18next';

import pawPrintXml from '../assets/pawPrint';
import darkModePawPrintXml from '../assets/darkMode/darkModePawPrint';

import EntryForm from '../components/EntryForm';
import SettingsModal from '../components/SettingsModal';
import { useAppContext } from '../context/AppContext';
import { useThemeContext } from '../context/ThemeContext';

const EntryScreen = () => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const { setIsSettingsOpen } = useAppContext();

  const handleSettingsPress = () => {
    setIsSettingsOpen(true);
  };

  const renderPawPrint = () => {
    if (theme === 'light') {
      return <SvgXml style={styles.settingsIcon} xml={pawPrintXml} width="15" height="15"/>;
    }
    else {
      return <SvgXml style={styles.settingsIcon} xml={darkModePawPrintXml} width="15" height="15"/>;
    }
  }

  return (
    <View style={styles.container}>
      <EntryForm />
      <View style={styles.settings}>
        <TouchableOpacity style={styles.settingsTextRow} onPress={handleSettingsPress}>
          <Text style={styles.settingsText}>{t('settings')}</Text>
          {renderPawPrint()}
        </TouchableOpacity>
      </View>
      <SettingsModal />
    </View>
  );
}

const getStyles = (theme: string) => StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  settings: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  settingsTextRow: {
    flexDirection: 'row',
  },
  settingsText: {
    fontSize: 15,
    fontVariant: ['small-caps'],
    paddingRight: 5,
    color: theme === 'light' ? '#121212' : 'white',
  },
  settingsIcon: {
    marginTop: 2,
  }
});

export default EntryScreen;
