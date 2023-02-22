import * as ActionTypes from '../constants/app.constants';

export const userInfo = values => ({
  type: ActionTypes.USER_INFO_REQUEST,
  payload: values,
});
export const userInfoSuccess = userInfo => ({
  type: ActionTypes.USER_INFO_SUCCESS,
  payload: userInfo,
});
export const userInfoError = error => ({
  type: ActionTypes.USER_INFO_ERROR,
  payload: error,
});
export const userKurerInfo = values => ({
  type: ActionTypes.USER_KURER_INFO_REQUEST,
  payload: values,
});
export const userKurerInfoSuccess = userInfo => ({
  type: ActionTypes.USER_KURER_INFO_SUCCESS,
  payload: userInfo,
});
export const userKurerInfoError = error => ({
  type: ActionTypes.USER_KURER_INFO_ERROR,
  payload: error,
});

/* Change User Info */
export const changeUserInfo = values => ({
  type: ActionTypes.CHANGE_USER_INFO_REQUEST,
  payload: values,
});
export const changeUserInfoSuccess = userInfo => ({
  type: ActionTypes.CHANGE_USER_INFO_SUCCESS,
  payload: userInfo,
});
export const changeUserInfoError = error => ({
  type: ActionTypes.CHANGE_USER_INFO_ERROR,
  payload: error,
});

/* Change Password */
export const changePassword = (values, callback) => ({
  type: ActionTypes.CHANGE_PASSWORD_REQUEST,
  payload: values,
  callback,
});
export const changePasswordSuccess = () => ({
  type: ActionTypes.CHANGE_PASSWORD_SUCCESS,
});
export const changePasswordError = error => ({
  type: ActionTypes.CHANGE_PASSWORD_ERROR,
  payload: error,
});

export const changeSocial = (values, callback) => ({
  type: ActionTypes.CHANGE_SOCIAL_REQUEST,
  payload: values,
  callback,
});
export const changeSocialSuccess = userInfo => ({
  type: ActionTypes.CHANGE_SOCIAL_SUCCESS,
  payload: userInfo,
});
export const changeSocialError = error => ({
  type: ActionTypes.CHANGE_SOCIAL_ERROR,
  payload: error,
});
