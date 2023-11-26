import AsyncStorage from '@react-native-async-storage/async-storage';

export const generateId = () => {
  const timestamp = new Date().getTime();
  const randomSection = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomSection}`;
};

export const setId = async (value: string) => {
  try {
    await AsyncStorage.setItem('id', value);
  } catch (error) {
    console.error('Failed to save user id to storage');
  }
};

export const getId = async () => {
  try {
    return await AsyncStorage.getItem('id');
  } catch (error) {
    console.error('Failed to get user id from storage');
  }
};


