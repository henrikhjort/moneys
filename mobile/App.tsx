import { StyleSheet, View, SafeAreaView, Text } from 'react-native';

import './translation';
import AppComponent from './components/AppComponent';
import { AppProvider } from './context/AppContext';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import BaseScreen from './screens/BaseScreen';
import TabSelector from './components/TabSelector';

export default function App() {
  return (
    <ThemeProvider>
    <UserProvider>
      <AppProvider>
        <AppComponent />
      </AppProvider>
    </UserProvider>
    </ThemeProvider>
  );
}
