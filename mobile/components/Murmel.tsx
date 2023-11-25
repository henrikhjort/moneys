import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

import murmelXml from '../assets/murmel';
import murmelBlinkXml from '../assets/murmelBlink';
import murmelAngryXml from '../assets/angryMurmel';
import happyMurmelXml from '../assets/happyMurmel';

type MurmelProps = {
  angry: boolean;
  happy: boolean;
};

const Murmel = ({ angry, happy }: MurmelProps) => {
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

  return (
    <View style={styles.container}>
      {isBlinking 
        ? <SvgXml xml={murmelBlinkXml} width="150" height="150"/>
        : angry 
          ? <SvgXml xml={murmelAngryXml} width="150" height="150"/>
          : happy
            ? <SvgXml xml={happyMurmelXml} width="150" height="150"/>
            : <SvgXml xml={murmelXml} width="150" height="150"/>
      }
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
