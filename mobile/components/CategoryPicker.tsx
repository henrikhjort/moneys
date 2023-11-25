import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';

import Category from '../types/Category';

import { getEmojiForCategory } from '../utils/helpers';

type CategoryPickerProps = {
  label?: string;
  selectedValue: Category | null;
  onValueChange: (value: Category | null) => void;
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({ label, selectedValue, onValueChange }) => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const translateCategory = (category: Category | null) => {
    if (!category) {
      return t('categoryPlaceholder');
    } else {
      return `${t(category)} ${getEmojiForCategory(category)}`;
    }
  }

  const categoryOptions = Object.values(Category).map(key => ({
    label: `${translateCategory(key)} ${getEmojiForCategory(key)}`,
    value: key
  }));

  const isPlaceholder = selectedValue === null;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.touchable} onPress={() => setModalVisible(true)}>
        <Text style={isPlaceholder ? styles.placeholderText : styles.touchableText}>{`${translateCategory(selectedValue)}`}</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue, itemIndex) => {
              onValueChange(itemValue as Category);
              setModalVisible(false);
            }}
            style={styles.picker}
          >
            {categoryOptions.map((option, index) => (
              <Picker.Item key={index} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  touchable: {
    height: 40,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  touchableText: {
    fontSize: 16,
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
    backgroundColor: 'white',
  },
  placeholderText: {
    fontSize: 16,
    color: '#C7C7CD',
  },
});

export default CategoryPicker;
