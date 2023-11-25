import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { SvgXml } from 'react-native-svg';

import murmelFromBelowXml from '../assets/murmelFromBelow';
import grabbingMurmelXml from '../assets/grabbingMurmel';

const MurmelFromBelow = () => {
  const [currentSvg, setCurrentSvg] = useState(murmelFromBelowXml);
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const startBounce = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    let intervalId: any;

    intervalId = setInterval(() => {
      setCurrentSvg(prevSvg => {
        if (prevSvg === murmelFromBelowXml) {
          startBounce();
          return grabbingMurmelXml;
        } else {
          bounceAnim.setValue(0);
          return murmelFromBelowXml;
        }
      });
    }, 10000);

    return () => {
      clearInterval(intervalId);
      bounceAnim.stopAnimation();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
        <SvgXml xml={currentSvg} width="150" height="150"/>
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
