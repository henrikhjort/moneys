import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

import murmelXml from '../assets/murmel';
import murmelBlinkXml from '../assets/murmelBlink';
import murmelAngryXml from '../assets/angryMurmel';
import happyMurmelXml from '../assets/happyMurmel';
import moneyEyesXml from '../assets/moneyEyes';

type MurmelProps = {
  angry: boolean;
  happy: boolean;
  greedy: boolean;
};

const Murmel = ({ angry, happy, greedy }: MurmelProps) => {
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
    if (isBlinking) {
      return <SvgXml xml={murmelBlinkXml} width="150" height="150"/>;
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

  return (
    <View style={styles.container}>
      {renderMurmelSvg()}
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
