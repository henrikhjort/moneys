import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

import murmelXml from '../assets/murmel';
import murmelDarkModeXml from '../assets/darkMode/murmelDarkMode';

import murmelBlinkXml from '../assets/murmelBlink';
import murmelDarkModeBlinkXml from '../assets/darkMode/murmelDarkModeBlink';

import murmelAngryXml from '../assets/angryMurmel';
import angryDarkModeMurmelXml from '../assets/darkMode/angryDarkModeMurmel';

import happyMurmelXml from '../assets/happyMurmel';
import happyDarkModeMurmelXml from '../assets/darkMode/happyDarkModeMurmel';

import moneyEyesXml from '../assets/moneyEyes';
import darkModeMoneyEyesXml from '../assets/darkMode/darkModeMoneyEyes';

import murmelMouthOpenXml from '../assets/murmelMouthOpen';
import murmelDarkModeMouthOpenXml from '../assets/darkMode/murmelDarkModeMouthOpen';

import { useAppContext } from '../context/AppContext';
import { useThemeContext } from '../context/ThemeContext';

type MurmelProps = {
  angry: boolean;
  happy: boolean;
  greedy: boolean;
};

const Murmel = ({ angry, happy, greedy }: MurmelProps) => {
  const { theme } = useThemeContext();
  const { isBrowsingCategories, isSettingsOpen } = useAppContext();
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);

      const blinkDuration = setTimeout(() => {
        setIsBlinking(false);
      }, 75); // Blink duration

      return () => clearTimeout(blinkDuration);

    }, 10000); // Interval between blinks

    return () => clearInterval(blinkInterval);
  }, []);

  const renderMurmelSvg = () => {
    if (isBlinking && !isSettingsOpen) {
      return <SvgXml xml={murmelBlinkXml} width="150" height="150"/>;
    }
    if (isBrowsingCategories) {
      return <SvgXml xml={murmelMouthOpenXml} width="150" height="150"/>;
    }
    if (greedy) {
      return <SvgXml xml={moneyEyesXml} width="150" height="150"/>;
    }
    if (angry) {
      return <SvgXml xml={murmelAngryXml} width="150" height="150"/>;
    }
    if (happy) {
      return <SvgXml xml={happyMurmelXml} width="150" height="150"/>;
    }
    return <SvgXml xml={murmelXml} width="150" height="150"/>;
  };

  const renderMurmelDarkMode = () => {
    if (isBlinking && !isSettingsOpen) {
      return <SvgXml xml={murmelDarkModeBlinkXml} width="150" height="150"/>;
    }
    if (isBrowsingCategories) {
      return <SvgXml xml={murmelDarkModeMouthOpenXml} width="150" height="150"/>;
    }
    if (greedy) {
      return <SvgXml xml={darkModeMoneyEyesXml} width="150" height="150"/>;
    }
    if (angry) {
      return <SvgXml xml={angryDarkModeMurmelXml} width="150" height="150"/>;
    }
    if (happy) {
      return <SvgXml xml={happyDarkModeMurmelXml} width="150" height="150"/>;
    }
    return <SvgXml xml={murmelDarkModeXml} width="150" height="150"/>;
  }

  const render = () => {
    if (theme === 'light') {
      return renderMurmelSvg();
    }
    else {
      return renderMurmelDarkMode();
    }
  }

  return (
    <View style={styles.container}>
      {render()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Murmel;
