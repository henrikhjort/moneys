import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SvgXml } from 'react-native-svg';
import { useTranslation } from 'react-i18next';

import murmelHandsXml from '../assets/murmelHands';
import darkModeHandsXml from '../assets/darkMode/darkModeHands';

import murmelHandsLeftXml from '../assets/murmelHandsLeft';
import darkModeHandsLeftXml from '../assets/darkMode/darkModeHandsLeft';

import murmelHandsRightXml from '../assets/murmelHandsRight';
import darkModeHandsRightXml from '../assets/darkMode/darkModeHandsRight';

import { getDefaultCategories } from '../utils/helpers';
import { useAppContext } from '../context/AppContext';
import { useUserContext } from '../context/UserContext';
import { useThemeContext } from '../context/ThemeContext';
import { white, secondaryWhite, black, secondaryBlack, purple, secondaryPurple, placeholder } from '../styles/colors';

type CategoryPickerProps = {
  label?: string;
  selectedValue: string | null;
  onValueChange: (value: string | null) => void;
  disabled?: boolean;
  setIsModalOpen: (value: boolean) => void;
}

enum Hands {
  LEFT = 'left',
  RIGHT = 'right',
};

const CategoryPicker: React.FC<CategoryPickerProps> = ({ label, selectedValue, onValueChange, disabled, setIsModalOpen }) => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const { setIsBrowsingCategories } = useAppContext();
  const { customCategories } = useUserContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [hands, setHands] = useState<Hands>(Hands.LEFT);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const defaultCategories = getDefaultCategories();
    setCategories([...defaultCategories, ...customCategories]);
  }, [customCategories]);

  useEffect(() => {
    let intervalId: any;

    if (modalVisible) {
      intervalId = setInterval(() => {
        setHands(prevHands => {
          if (prevHands === Hands.LEFT) return Hands.RIGHT;
          if (prevHands === Hands.RIGHT) return Hands.LEFT;
          return Hands.LEFT;
        });
      }, 250);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [modalVisible]);

  const categoryOptions = categories.map(category => ({
    label: category,
    value: category,
  }));

  const closeModal = () => {
    setModalVisible(false);
    setIsModalOpen(false);
    setIsBrowsingCategories(false);
  }

  const isPlaceholder = selectedValue === null;

  const renderLightModeHands = () => {
    switch (hands) {
      case Hands.LEFT:
        return <SvgXml xml={murmelHandsLeftXml} width="200" height="150" />;
      case Hands.RIGHT:
        return <SvgXml xml={murmelHandsRightXml} width="200" height="150" />;
      default:
        return <SvgXml xml={murmelHandsXml} width="200" height="150" />;
    }
  }

  const renderDarkModeHands = () => {
    switch (hands) {
      case Hands.LEFT:
        return <SvgXml xml={darkModeHandsLeftXml} width="200" height="150" />;
      case Hands.RIGHT:
        return <SvgXml xml={darkModeHandsRightXml} width="200" height="150" />;
      default:
        return <SvgXml xml={darkModeHandsXml} width="200" height="150" />;
    }
  }

  const renderHands = () => {
    if (theme === 'light') {
      return renderLightModeHands();
    }
    else {
      return renderDarkModeHands();
    }
  }

  const translateCategory = (category: string | null) => {
    if (!category) return null;
    const translation = t(category);
    if (!translation) return category;
    return translation;
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.touchable} onPress={() => {
        Keyboard.dismiss();
        setModalVisible(true);
        setIsBrowsingCategories(true);
        setIsModalOpen(true);
      }}>
        <Text 
          style={[
            isPlaceholder ? styles.placeholderText : styles.touchableText,
            disabled && styles.inputDisabled
          ]}
        >
          {isPlaceholder ? t('categoryPlaceholder') : translateCategory(selectedValue)}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={() => closeModal()}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
          <View>
            {renderHands()}
          </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => closeModal()}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Picker
              enabled={!disabled}
              selectedValue={selectedValue}
              onValueChange={(itemValue, itemIndex) => {
                onValueChange(itemValue);
                closeModal();
              }}
              style={styles.picker}
            >
              {categoryOptions.map((option, index) => (
                <Picker.Item color={theme === 'light' ? black : white} key={index} label={translateCategory(option.label) || ''} value={option.value} />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const getStyles = (theme: string) => StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: theme === 'light' ? black : white,
  },
  touchable: {
    height: 40,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderColor: theme === 'light' ? black : white,
  },
  touchableText: {
    fontSize: 18,
    color: theme === 'light' ? black : white,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 120,
  },
  picker: {
    width: '100%',
    height: 200,
    backgroundColor: theme === 'light' ? white : secondaryBlack,
    marginTop: -50,
  },
  placeholderText: {
    fontSize: 16,
    color: placeholder,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme === 'light' ? 'rgba(0, 0, 0, .3)' : 'rgba(0, 0, 0, 0.2)',
  },
  modalContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 100,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 16,
    color: theme === 'light' ? black : white,
    fontWeight: 'bold',
  },
  inputDisabled: {
    color: '#C7C7CD',
  },
});

export default CategoryPicker;
