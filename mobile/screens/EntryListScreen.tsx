import { StyleSheet, View } from 'react-native';

import EntryList from '../components/EntryList';

import type { Entry } from '../types/Entry';

type EntryListScreenProps = {
  entries: Entry[];
}

const EntryListScreen = ({ entries }: EntryListScreenProps) => {

  return (
    <View style={styles.container}>
      <EntryList entries={entries} />
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
