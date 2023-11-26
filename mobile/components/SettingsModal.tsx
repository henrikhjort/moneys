import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useAppContext } from '../context/AppContext';

const SettingsModal = () => {
  const { isSettingsOpen, setIsSettingsOpen } = useAppContext();

  const handleClose = () => {
    setIsSettingsOpen(false);
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isSettingsOpen}
      onRequestClose={handleClose}>
      <TouchableOpacity style={styles.overlay} onPress={handleClose} activeOpacity={1}>
        <View style={styles.modalView}>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalView: {
    width: '80%',
    height: '60%',
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 35,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default SettingsModal;
