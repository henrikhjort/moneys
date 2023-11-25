import React from 'react';
import { StyleSheet, View } from 'react-native';

import EntryList from '../components/EntryList';

const EntryListScreen = () => {

  return (
    <View style={styles.container}>
      <EntryList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default EntryListScreen;
