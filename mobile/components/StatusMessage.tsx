import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import type Status from '../types/Status';

type StatusMessageProps = {
  status: Status;
  duration?: number;
};

const StatusMessage = ({ status, duration = 3000 }: StatusMessageProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <View style={[styles.container, status.success ? styles.success : styles.error]}>
      <Text style={styles.text}>{status.message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0, // Changed from top to bottom
    left: 0,
    right: 0,
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, // Add zIndex to ensure it's above other elements
  },
  success: {
    backgroundColor: 'green',
  },
  error: {
    backgroundColor: 'red',
  },
  text: {
    color: 'white',
  },
});


export default StatusMessage;
