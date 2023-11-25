import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

import murmelFromBelowXml from '../assets/murmelFromBelow';

const MurmelFromBelow = () => {
  return (
    <View style={styles.container}>
      <SvgXml xml={murmelFromBelowXml} width="150" height="150"/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MurmelFromBelow;
