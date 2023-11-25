import { StyleSheet, View } from 'react-native';

import EntryForm from '../components/EntryForm';

import type { Entry } from '../types/Entry';

const EntryScreen = () => {

  return (
    <View style={styles.container}>
      <EntryForm />
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
