import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

type ButtonProps = {
  onPress: () => void;
  title: string;
  disabled?: boolean;
};

const Button = ({ onPress, title, disabled = false }: ButtonProps) => {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};


const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
    width: '100%',
  },
  pressed: {
    backgroundColor: '#333',
  },
  disabled: {
    backgroundColor: '#999',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});


export default Button;
