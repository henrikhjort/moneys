import { StyleSheet, View, Text } from 'react-native';

import './translation';
import { AppProvider } from './context/AppContext';
import BaseScreen from './screens/BaseScreen';
import TabSelector from './components/TabSelector';

export default function App() {

  return (
    <AppProvider>
      <View style={styles.container}>
        <TabSelector />
        <BaseScreen />
      </View>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 20,
  },
});
