import { StyleSheet, View } from 'react-native';

import EntryList from '../components/EntryList';
import EntryForm from '../components/EntryForm';

import { Screen } from '../types/Screen';

import { useAppContext } from '../context/AppContext';

const BaseScreen = () => {
  const { currentScreen } = useAppContext();

  const renderScreen = () => {
    if (currentScreen === Screen.INPUT) {
      return <EntryForm />;
    } else {
      return <EntryList />;
    }
  }

  return (
    <View style={styles.container}>
      {renderScreen()}
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

export default BaseScreen;
