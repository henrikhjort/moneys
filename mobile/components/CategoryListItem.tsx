import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import deleteCategory from '../api/deleteCategory';
import { useUserContext } from '../context/UserContext';

type CategoryListItemProps = {
  category: string;
}

const CategoryListItem = ({ category }: CategoryListItemProps) => {
  const { t } = useTranslation();
  const { userId, customCategories, setCustomCategories } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteCategory = async () => {
    if (!userId) return;
    setIsLoading(true);
    const deletedCategory = await deleteCategory(category, userId);
    setCustomCategories(customCategories.filter((category) => category !== deletedCategory));
    setIsLoading(false);
  }

  return (
    <View style={styles.itemContainer}>
      <View style={styles.dataContainer}>
        <Text>{t(category)}</Text>
      </View>
      <View style={styles.deleteContainer}>
        <TouchableOpacity onPress={handleDeleteCategory} style={styles.deleteButton}>
          {isLoading ? <ActivityIndicator size="small" color="#C7C7CD" /> : <Text>❌</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  dataContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  deleteContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  deleteButton: {
    padding: 0,
  },
});

export default CategoryListItem;
