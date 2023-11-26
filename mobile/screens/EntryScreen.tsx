import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useTranslation } from 'react-i18next';

import pawPrintXml from '../assets/pawPrint';
import EntryForm from '../components/EntryForm';
import SettingsModal from '../components/SettingsModal';

const EntryScreen = () => {
  const { t } = useTranslation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSettingsPress = () => {
    setIsSettingsOpen(true);
  };

  return (
    <View style={styles.container}>
      <EntryForm />
      <View style={styles.settings}>
        <TouchableOpacity style={styles.settingsTextRow} onPress={handleSettingsPress}>
          <Text style={styles.settingsText}>{t('settings')}</Text>
          <SvgXml style={styles.settingsIcon} xml={pawPrintXml} width="15" height="15"/>
        </TouchableOpacity>
      </View>
      <SettingsModal isVisible={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
  settingsIcon: {
    marginTop: 2,
  }
});

export default EntryScreen;
