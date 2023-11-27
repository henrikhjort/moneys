import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SvgXml } from 'react-native-svg';

import CategoryEditor from './CategoryEditor';
import ThemeSwitcher from './ThemeSwitcher';
import { useAppContext } from '../context/AppContext';
import { useThemeContext } from '../context/ThemeContext';
import Button from './Button';

import settingsMurmelXml from '../assets/settingsMurmel';
import darkModeSettingsMurmelXml from '../assets/darkMode/darkModeSettingsMurmel';

enum Menu {
  Root = 'Root',
  CategoryEditor = 'CategoryEditor',
}

const SettingsModal = () => {
  const { t } = useTranslation();
  const { isSettingsOpen, setIsSettingsOpen } = useAppContext();
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const [menu, setMenu] = useState<Menu>(Menu.Root);

  const handleClose = () => {
    setIsSettingsOpen(false);
  };

  const renderMenu = () => {
    switch (menu) {
      case Menu.CategoryEditor:
        return <CategoryEditor />;
      default:
        return (
          <View style={styles.menuList}>
            <Button style={styles.menuListItem} title={t('menu_categories')} onPress={() => setMenu(Menu.CategoryEditor)} />
            <ThemeSwitcher />
          </View>
        );
    }
  }

  const handleBack = () => {
    setMenu(Menu.Root);
  }

  const renderSvg = () => {
    if (menu === Menu.Root) {
      if (theme === 'light') {
        return <SvgXml xml={settingsMurmelXml} width="150" height="150"/>;
      }
      return <SvgXml xml={darkModeSettingsMurmelXml} width="150" height="150"/>;
    }
  }

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isSettingsOpen}
      onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modalView}>
          {menu === Menu.Root && (
            <Text style={styles.title}>{t('settings')}</Text>
          )}
          <View style={styles.safeArea}></View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
          >
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          {menu !== Menu.Root && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
          >
            <Text style={styles.backButtonText}>{"Takaisin"}</Text>
          </TouchableOpacity>
          )}
          {renderMenu()}
          {renderSvg()}
        </View>
      </View>
    </Modal>
  );
}

const getStyles = (theme: string) => StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalView: {
    width: '95%',
    height: '90%',
    backgroundColor: theme === 'light' ? 'white' : '#121212',
    borderRadius: 4,
    padding: 20,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  menuList: {
    flex: 1,
    width: '100%',
  },
  menuListItem: {
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme === 'light' ? '#121212' : 'white',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme === 'light' ? '#121212' : 'white',
  },
  safeArea: {
    height: 45,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    color: theme === 'light' ? '#121212' : 'white',
  }
});

export default SettingsModal;

