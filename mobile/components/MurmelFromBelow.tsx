import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { SvgXml } from 'react-native-svg';

import murmelFromBelowXml from '../assets/murmelFromBelow';
import darkModeBelowXml from '../assets/darkMode/darkModeBelow';

import grabbingMurmelXml from '../assets/grabbingMurmel';
import darkModeGrabbingXml from '../assets/darkMode/darkModeGrabbing';

import angryGrabbingXml from '../assets/angryGrabbing';
import darkModeAngryGrabXml from '../assets/darkMode/darkModeAngryGrab';

import { useAppContext } from '../context/AppContext';
import { useThemeContext } from '../context/ThemeContext';

const MurmelFromBelow = () => {
  const { theme } = useThemeContext();
  const { isRefreshing, entryDeleted } = useAppContext();
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRefreshing || entryDeleted) {
      startBounce();
    } else {
      bounceAnim.setValue(0);
    }
  }, [isRefreshing, entryDeleted]);

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

  const renderLightMode = () => {
    if (isRefreshing) {
      return <SvgXml xml={grabbingMurmelXml} width="150" height="150"/>;
    } else if (entryDeleted) {
      return <SvgXml xml={angryGrabbingXml} width="150" height="150"/>;
    } else {
      return <SvgXml xml={murmelFromBelowXml} width="150" height="150"/>;
    }
  };

  const renderDarkMode = () => {
    if (isRefreshing) {
      return <SvgXml xml={darkModeGrabbingXml} width="150" height="150"/>;
    } else if (entryDeleted) {
      return <SvgXml xml={darkModeAngryGrabXml} width="150" height="150"/>;
    } else {
      return <SvgXml xml={darkModeBelowXml} width="150" height="150"/>;
    }
  };

  const renderMurmelSvg = () => {
    if (theme === 'light') {
      return renderLightMode();
    } else {
      return renderDarkMode();
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
        {renderMurmelSvg()}
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
