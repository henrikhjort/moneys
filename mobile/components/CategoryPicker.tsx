import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';

import ScrollPicker from './ScrollPicker';

import { getDefaultCategories } from '../utils/helpers';
import { useAppContext } from '../context/AppContext';
import { useUserContext } from '../context/UserContext';
import { useThemeContext } from '../context/ThemeContext';
import { white, black, secondaryBlack, placeholder } from '../styles/colors';

type CategoryPickerProps = {
  label?: string;
  selectedValue: string | null;
  onValueChange: (value: string | null) => void;
  disabled?: boolean;
  setIsModalOpen: (value: boolean) => void;
  setIsScrolling: (value: boolean) => void;
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({ label, selectedValue, onValueChange, disabled, setIsModalOpen, setIsScrolling }) => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const { setIsBrowsingCategories } = useAppContext();
  const { customCategories } = useUserContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const defaultCategories = getDefaultCategories();
    setCategories([...defaultCategories, ...customCategories]);
  }, [customCategories]);

  const closeModal = () => {
    setModalVisible(false);
    setIsModalOpen(false);
    setIsBrowsingCategories(false);
  }

  const isPlaceholder = selectedValue === null;

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
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => closeModal()}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <ScrollPicker
              data={categories}
              handleClose={closeModal}
              onValueChange={onValueChange}
              selectedValue={selectedValue}
              setIsScrolling={setIsScrolling}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const getStyles = (theme: string | null) => StyleSheet.create({
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
  },
  picker: {
    width: '100%',
    height: 200,
    backgroundColor: theme === 'light' ? white : secondaryBlack,
  },
  placeholderText: {
    fontSize: 16,
    color: placeholder,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme === 'light' ? 'rgba(0, 0, 0, .3)' : 'rgba(0, 0, 0, 0.5)',
    zIndex: 9,
  },
  modalContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 185,
    backgroundColor: theme === 'light' ? white : secondaryBlack,
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
