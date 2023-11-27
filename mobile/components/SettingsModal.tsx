import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SvgXml } from 'react-native-svg';
import * as Clipboard from 'expo-clipboard';

import CategoryEditor from './CategoryEditor';
import ThemeSwitcher from './ThemeSwitcher';
import { useAppContext } from '../context/AppContext';
import { useUserContext } from '../context/UserContext';
import { useThemeContext } from '../context/ThemeContext';
import { white, black, purple, secondaryWhite, secondaryBlack } from '../styles/colors';
import { success, successDark } from '../styles/colors';
import Button from './Button';

import settingsMurmelXml from '../assets/settingsMurmel';
import darkModeSettingsMurmelXml from '../assets/darkMode/darkModeSettingsMurmel';
import copyXml from '../assets/copy';
import copyDarkXml from '../assets/darkMode/copyDark';
import getThemeStats from '../api/getThemeStats';

enum Menu {
  Root = 'Root',
  CategoryEditor = 'CategoryEditor',
}

type ThemeStats = {
  darkUserPercentage: number;
  lightUserPercentage: number;
}

const SettingsModal = () => {
  const { t } = useTranslation();
  const { isSettingsOpen, setIsSettingsOpen } = useAppContext();
  const { userId } = useUserContext();
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const [menu, setMenu] = useState<Menu>(Menu.Root);
  const [userIdCopied, setUserIdCopied] = useState(false);
  const [buttonStyle, setButtonStyle] = useState({});
  const [themeStats, setThemeStats] = useState<ThemeStats | null>(null);

  useEffect(() => {
    if (userIdCopied) {
      setTimeout(() => {
        setUserIdCopied(false);
        setButtonStyle({});
      }, 1000);
    }
  });

  useEffect(() => {
    const getStats = async () => {
      if (userId) {
        try {
          const res = await getThemeStats(userId);
          setThemeStats(res);
        } catch (error) {
          return;
        }
      }
    }
    if (userId) {
      getStats();
    }
  }, [theme, userId]);

  const copyIconLight = <SvgXml xml={copyXml} width="15" height="15"/>;
  const copyIconDark = <SvgXml xml={copyDarkXml} width="15" height="15"/>;

  const copyIcon = () => {
    if (theme === 'light') {
      return copyIconDark;
    }
    return copyIconDark;
  }

  const handleClose = () => {
    setIsSettingsOpen(false);
  };


  const handleUserIdClick = async () => {
    if (userId) {
      await Clipboard.setStringAsync(userId);
      setUserIdCopied(true);
      setButtonStyle(styles.success);
    }
  }

  const renderMenu = () => {
    switch (menu) {
      case Menu.CategoryEditor:
        return <CategoryEditor />;
      default:
        return (
          <View style={styles.menuList}>
            <Button style={styles.menuListItem} title={t('menu_categories')} onPress={() => setMenu(Menu.CategoryEditor)} />
            <Button icon={copyIcon()} style={[styles.menuListItem, buttonStyle]} title={t('menu_copy_user_id')} onPress={handleUserIdClick} />
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

  const themeStatsText = () => {
    if (theme && themeStats) {
      if (theme === 'dark' && themeStats.darkUserPercentage > 0) {
        return `${themeStats.darkUserPercentage}${t('theme_stats_dark')}`;
      }
      else if (theme === 'light' && themeStats.lightUserPercentage > 0) {
        return `${themeStats.lightUserPercentage}${t('theme_stats_light')}`;
      }
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
          <Text style={styles.themeStats}>{themeStatsText()}</Text>
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
            <Text style={styles.backButtonText}>{t('back')}</Text>
          </TouchableOpacity>
          )}
          {renderMenu()}
          {renderSvg()}
        </View>
      </View>
    </Modal>
  );
}

const getStyles = (theme: string | null) => StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  themeStats: {
    fontSize: 12,
    color: theme === 'light' ? black : white,
  },
  modalView: {
    width: '95%',
    height: '90%',
    backgroundColor: theme === 'light' ? white : black,
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
    marginBottom: 15,
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
    color: theme === 'light' ? black : white,
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
    color: theme === 'light' ? black : white,
  },
  safeArea: {
    height: 45,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    color: theme === 'light' ? black : white,
  },
  success: {
    backgroundColor: theme === 'light' ? success : successDark,
  }
});

export default SettingsModal;

