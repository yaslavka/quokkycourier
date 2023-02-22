import {takeEvery, call, put, all} from 'redux-saga/effects';

import * as ActionTypes from '../constants/app.constants';
import * as actions from '../actions/app.actions';
import * as api from '../api/app.api';
import {Alert} from 'react-native';

export function* userInfo() {
  try {
    const userInfo = yield call(api.userInfo);
    if (userInfo) {
      yield put(actions.userInfoSuccess(userInfo));
    }
  } catch (error) {
    yield put(actions.userInfoError(error));

    Alert.alert(error.message);
  }
}
export function* changeUserInfo({payload, callback}) {
  try {
    const userInfo = yield call(api.changeUserInfo, payload);
    if (userInfo) {
      yield put(actions.changeUserInfoSuccess(userInfo));

      Alert.alert('Данные успешно обновлены');
      callback && callback();
    }
  } catch (error) {
    yield put(actions.changeUserInfoError(error));

    Alert.alert(error.message);
  }
}
export function* changePassword({payload, callback}) {
  try {
    const response = yield call(api.changePassword, payload);
    if (response) {
      yield put(actions.changePasswordSuccess());

      Alert.alert('Пароль успешно обновлен');
      callback && callback();
    }
  } catch (error) {
    yield put(actions.changePasswordError(error));

    Alert.alert(error.message);
  }
}
export function* changeSocial({payload, callback}) {
  try {
    const response = yield call(api.changeSocial, payload);
    if (response) {
      yield put(actions.changeSocialSuccess(response));

      Alert.alert('Социальные сети успешно обновлены');
      callback && callback();
    }
  } catch (error) {
    yield put(actions.changeSocialError(error));

    Alert.alert(error.message);
  }
}

export default function* appSagas() {
  yield all([
    takeEvery(ActionTypes.USER_INFO_REQUEST, userInfo),
    takeEvery(ActionTypes.CHANGE_USER_INFO_REQUEST, changeUserInfo),
    takeEvery(ActionTypes.CHANGE_PASSWORD_REQUEST, changePassword),
    takeEvery(ActionTypes.CHANGE_SOCIAL_REQUEST, changeSocial),
  ]);
}
