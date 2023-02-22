import axios from 'axios';
import Raven from 'raven-js';
import {getAccessToken} from '../utils';
import * as actions from '../actions/auth.actions';
import {store} from '../../index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';

export const baseInstance = axios.create({
  baseURL: 'https://6551eb3.online-server.cloud/api',
});
baseInstance.interceptors.request.use(
  async config => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    Raven.captureException(error);
    return Promise.reject(error);
  },
);
baseInstance.interceptors.response.use(
  response => response?.data,
  async error => {
    Raven.captureException(error);
    if (error?.response?.status === 401) {
      const timer = await AsyncStorage.getItem('access_token');
      await AsyncStorage.clear();
      await AsyncStorage.setItem('access_token', timer);

      store.store.dispatch(actions.signOut());
    } else if (error?.response) {
      // Global path to error message
      throw new Error(error?.response?.data?.message);
    } else {
      throw new Error(error?.message);
    }
  },
);
const createFormData = (avatar, body = {}) => {
  const data = new FormData();
  data.append('avatar', {
    name: avatar.assets[0].fileName,
    uri:
      Platform.OS === 'ios'
        ? avatar.assets[0].uri.replace('file://', '')
        : avatar.assets[0].uri,
    type: avatar.assets[0].type,
  });
  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });
  return data;
};
const createFormDataPassportRazvorot = (passportr, body = {}) => {
  console.log(passportr);
  const data = new FormData();
  data.append('passportr', {
    name: passportr.assets[0].fileName,
    uri:
      Platform.OS === 'ios'
        ? passportr.assets[0].uri.replace('file://', '')
        : passportr.assets[0].uri,
    type: passportr.assets[0].type,
  });
  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });
  return data;
};

const createFormDataPassportPropiska = (passportp, body = {}) => {
  const data = new FormData();
  data.append('passportp', {
    name: passportp.assets[0].fileName,
    uri:
      Platform.OS === 'ios'
        ? passportp.assets[0].uri.replace('file://', '')
        : passportp.assets[0].uri,
    type: passportp.assets[0].type,
  });
  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });
  return data;
};

const createFormDataPassportS = (passports, body = {}) => {
  const data = new FormData();
  data.append('passports', {
    name: passports.assets[0].fileName,
    uri:
      Platform.OS === 'ios'
        ? passports.assets[0].uri.replace('file://', '')
        : passports.assets[0].uri,
    type: passports.assets[0].type,
  });
  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });
  return data;
};

export const api = {
  setzakazid(id) {
    return baseInstance.get(`/kur/myzakaz?zakaz=${id}`);
  },
  setVzakazid(id) {
    return baseInstance.get(`/kur/vzakaz?zakaz=${id}`);
  },
  async signUp(userInfo) {
    return await baseInstance.post('/kur/registration', userInfo);
  },
  async typed(userInfo) {
    return await baseInstance.post('/kur/typed', userInfo);
  },
  resetPassword(email) {
    return baseInstance.post('/kur/registration/restore-password', {email});
  },
  debitCard(data) {
    return baseInstance.post('/kur/debit', data);
  },
  ibanssss(data) {
    return baseInstance.post('/kur/ibanss', data);
  },
  payPals(data) {
    return baseInstance.post('/kur/payPals', data);
  },
  vyvodibanssss(data) {
    return baseInstance.post('/kur/vyvodibanss', data);
  },
  vyvodpayPals(data) {
    return baseInstance.post('/kur/vyvodpayPals', data);
  },
  async helpp(data) {
    return await baseInstance.post('/kur/help', data);
  },
  async signIn(data) {
    return await baseInstance.post('/kur/login', data);
  },
  async getUserInfo() {
    return await baseInstance.get('/kur');
  },
  async getZakaz() {
    return await baseInstance.get('/kur/zakazy');
  },
  async getZakazHystory() {
    return await baseInstance.get('/kur/zakazy/hystory');
  },
  async getZakazy() {
    return await baseInstance.get('/kur/allzakaz');
  },
  async getChangeuser(data) {
    return await baseInstance.post('/kur/info', data);
  },
  async getDellete(data) {
    return await baseInstance.post('/kur/dellete', data);
  },
  async getStatus(data) {
    return await baseInstance.post('/kur/status', data);
  },
  async updateAvatar(avatar) {
    const token = await getAccessToken();
    await fetch('https://6551eb3.online-server.cloud/api/kur/avatars', {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: createFormData(avatar),
    });
  },
  async updatepassPortrazvorot(passportr) {
    const token = await getAccessToken();
    await fetch(
      'https://6551eb3.online-server.cloud/api/kur/passportrazvorot',
      {
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: createFormDataPassportRazvorot(passportr),
      },
    );
  },
  async updatepassPortp(passportp) {
    const token = await getAccessToken();
    await fetch(
      'https://6551eb3.online-server.cloud/api/kur/passportpropiska',
      {
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: createFormDataPassportPropiska(passportp),
      },
    );
  },
  async updatepassPorts(passports) {
    const token = await getAccessToken();
    await fetch('https://6551eb3.online-server.cloud/api/kur/passportselfi', {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: createFormDataPassportS(passports),
    });
  },
};
