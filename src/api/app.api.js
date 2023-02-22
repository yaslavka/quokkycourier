import {baseInstance} from './index';

export const userInfo = async () =>
  await baseInstance({url: '/kur', method: 'get'});
export const userKurerInfo = async () =>
  await baseInstance({url: '/kur', method: 'get'});
export const changeUserInfo = data =>
  baseInstance({url: '/kur/fio', method: 'post', data});
export const changePassword = data =>
  baseInstance({url: '/kur/password', method: 'post', data});
export const changeSocial = data =>
  baseInstance({url: '/kur/links', method: 'post', data});
