import React, { useState, useRef, RefObject } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import { white, black, placeholder, purple, secondaryWhite } from '../styles/colors';

import { useThemeContext } from '../context/ThemeContext';

type ScrollPickerProps = {
  data: string[];
  handleClose: () => void;
  onValueChange: (value: string) => void;
  selectedValue: string | null;
  setIsScrolling: (value: boolean) => void;
};

const ScrollPicker = ({ data, handleClose, onValueChange, setIsScrolling }: ScrollPickerProps) => {
  const { t } = useTranslation();
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const scrollViewRef: RefObject<ScrollView> = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const itemHeight = 60;
  const displayHeight = 200; // Height of the area where items are displayed
  const padding = (displayHeight - itemHeight) / 2;

  const handleSelect = (value: string, index: number) => {
    if (index === selectedIndex) {
      onValueChange(value);
      handleClose();
    } else {
      // Snap to index.
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: index * itemHeight, animated: true });
      }
    }
  }
  
  const handleScroll = (event: any) => {
    setIsScrolling(true);
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / itemHeight);
    if (index > data.length - 1) return;
    setSelectedIndex(index);
  };

  const handleScrollEnd = () => {
    setIsScrolling(false);
  };

  const translateCategory = (category: string | null) => {
    if (!category) return null;
    const translation = t(category);
    if (!translation) return category;
    return translation;
  };

  return (
    <View style={[styles.container, { height: displayHeight }]}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={handleClose}
      >
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={[styles.contentContainer, { paddingTop: padding, paddingBottom: padding }]}
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        onScroll={handleScroll}
        onScrollEndDrag={handleScrollEnd}         // Add this
        onMomentumScrollEnd={handleScrollEnd} 
        scrollEventThrottle={16}
      >
        {data.map((item, index) => (
          <TouchableOpacity
            onPress={() => handleSelect(item, index)}
            key={index} 
            style={[
              styles.item, 
              { height: itemHeight, width: '100%' },
              index === selectedIndex && styles.selectedItem
            ]}
          >
            <Text style={index === selectedIndex ? styles.selectedItemText : styles.itemText}>
              {translateCategory(item)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const getStyles = (theme: string | null) => StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme === 'light' ? white : black,
    paddingBottom: 5,
    borderColor: white,
    borderWidth: 1,
    borderRadius: 10,
    zIndex: 10,
  },
  scrollView: {
    flexGrow: 1,
    width: '90%',
  },
  contentContainer: {
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    width: '100%',
  },
  selectedItem: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: theme === 'light' ? black : purple,
  },
  itemText: {
    fontSize: 18,
    color: theme === 'light' ? placeholder : secondaryWhite,
  },
  selectedItemText: {
    fontSize: 20,
    color: theme === 'light' ? black : white,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 16,
    color: theme === 'light' ? black : white,
    fontWeight: 'bold',
  },
});

export default ScrollPicker;
