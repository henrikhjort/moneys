import React from 'react';
import { StyleSheet, View } from 'react-native';

import EntryList from '../components/EntryList';
import MurmelFromBelow from '../components/MurmelFromBelow';
import DataSelector from '../components/DataSelector';

const EntryListScreen = () => {

  return (
    <View style={styles.container}>
      <EntryList />
      <View style={styles.murmel}>
        <MurmelFromBelow />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  murmel: {
    flex: 0.22,
    marginBottom: 0,
  },
});

export default EntryListScreen;
