import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAccessToken = async () => {
  try {
    const access_token = await AsyncStorage.getItem('access_token');
    if (access_token === null) {
      return null;
    }
    return access_token;
  } catch (error) {
    return error;
  }
};

export const formatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
});
export const setAccessToken = async ({access_token}) => {
  await AsyncStorage.setItem('access_token', access_token);
};
export const createFormDataObj = payload => {
  const formData = new FormData();
  for (let key in payload) {
    formData.append(key, payload[key]);
  }
  return formData;
};
export const isValidPassword = password => {
  const passwordValidation = /^.{6,}$/;
  return passwordValidation.test(password);
};
export const isValidPhone = phone => {
  const numberValidation =
    /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
  return numberValidation.test(phone);
};
export const isValidEmail = email => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
