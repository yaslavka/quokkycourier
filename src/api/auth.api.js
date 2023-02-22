import {baseInstance} from './index';
import {createFormDataObj} from '../utils';

export const signUp = userInfo =>
  baseInstance({
    url: '/kur/registration',
    method: 'post',
    data: userInfo,
  });

export const signIn = data =>
  baseInstance({
    url: '/kur/login',
    method: 'post',
    data: createFormDataObj({...data, grant_type: 'password'}),
  });
