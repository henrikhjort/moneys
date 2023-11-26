import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SvgXml } from 'react-native-svg';
import { useTranslation } from 'react-i18next';

import murmelHandsXml from '../assets/murmelHands';
import murmelHandsLeftXml from '../assets/murmelHandsLeft';
import murmelHandsRightXml from '../assets/murmelHandsRight';

import Category from '../types/Category';

import { useAppContext } from '../context/AppContext';
import { getEmojiForCategory } from '../utils/helpers';

type CategoryPickerProps = {
  label?: string;
  selectedValue: Category | null;
  onValueChange: (value: Category | null) => void;
  disabled?: boolean;
  setIsModalOpen: (value: boolean) => void;
}

enum Hands {
  LEFT = 'left',
  RIGHT = 'right',
};

const CategoryPicker: React.FC<CategoryPickerProps> = ({ label, selectedValue, onValueChange, disabled, setIsModalOpen }) => {
  const { t } = useTranslation();
  const { setIsBrowsingCategories } = useAppContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [hands, setHands] = useState<Hands>(Hands.LEFT);

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

  const translateCategory = (category: Category | null) => {
    if (!category) {
      return t('categoryPlaceholder');
    } else {
      return `${t(category)} ${getEmojiForCategory(category)}`;
    }
  }

  const categoryOptions = Object.values(Category).map(key => ({
    label: `${translateCategory(key)}`,
    value: key
  }));

  const closeModal = () => {
    setModalVisible(false);
    setIsModalOpen(false);
    setIsBrowsingCategories(false);
  }

  const isPlaceholder = selectedValue === null;

  const renderHands = () => {
    switch (hands) {
      case Hands.LEFT:
        return <SvgXml xml={murmelHandsLeftXml} width="200" height="150" />;
      case Hands.RIGHT:
        return <SvgXml xml={murmelHandsRightXml} width="200" height="150" />;
      default:
        return <SvgXml xml={murmelHandsXml} width="200" height="150" />;
    }
  }

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
          {`${translateCategory(selectedValue)}`}
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
          <View style={styles.hands}>
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
                onValueChange(itemValue as Category);
                closeModal();
              }}
              style={styles.picker}
            >
              {categoryOptions.map((option, index) => (
                <Picker.Item key={index} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
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
    marginTop: -50,
  },
  placeholderText: {
    fontSize: 16,
    color: '#C7C7CD',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
  hands: {
    
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
    color: '#333',
    fontWeight: 'bold',
  },
  inputDisabled: {
    color: '#C7C7CD',
  },
});

export default CategoryPicker;
