import { StyleSheet, View } from 'react-native';

import EntryForm from '../components/EntryForm';

import type { Entry } from '../types/Entry';

type EntryScreenProps = {
  entries: Entry[];
  setEntries: (entries: Entry[]) => void;
}

const EntryScreen = ({ entries, setEntries }: EntryScreenProps) => {

  return (
    <View style={styles.container}>
      <EntryForm entries={entries} setEntries={setEntries} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});

export default EntryScreen;
