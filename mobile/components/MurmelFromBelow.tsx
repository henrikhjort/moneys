import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { SvgXml } from 'react-native-svg';

import murmelFromBelowXml from '../assets/murmelFromBelow';
import grabbingMurmelXml from '../assets/grabbingMurmel';
import { useAppContext } from '../context/AppContext';

const MurmelFromBelow = () => {
  const { isRefreshing } = useAppContext();
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRefreshing) {
      startBounce();
    } else {
      bounceAnim.setValue(0);
    }
  }, [isRefreshing]);

  const startBounce = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
        {isRefreshing ? <SvgXml xml={grabbingMurmelXml} width="150" height="150"/> : <SvgXml xml={murmelFromBelowXml} width="150" height="150"/>}
      </Animated.View>
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
