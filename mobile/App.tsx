import { StyleSheet, View, SafeAreaView } from 'react-native';

import './translation';
import { AppProvider } from './context/AppContext';
import BaseScreen from './screens/BaseScreen';
import TabSelector from './components/TabSelector';

export default function App() {
  return (
    <AppProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <TabSelector />
          <BaseScreen />
        </View>
      </SafeAreaView>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
});
