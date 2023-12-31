import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';
import { white, black } from '../styles/colors';
import BaseScreen from '../screens/BaseScreen';
import TabSelector from '../components/TabSelector';

const AppComponent = () => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TabSelector />
        <BaseScreen />
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme: string | null) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme === 'light' ? white : black,
  },
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: theme === 'light' ? white : black,
  },
});

export default AppComponent;
