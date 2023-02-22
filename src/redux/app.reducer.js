import * as ActionTypes from '../constants/app.constants';
import * as AuthActionTypes from '../constants/auth.constants';

const initialState = {
  kurer: null,
  user: null,
  loadings: {
    kurer: false,
    user: false,
    changeUserInfo: false,
    changePassword: false,
    changeSocial: false,
  },
  errors: {
    kurer: null,
    user: null,
    changeUserInfo: null,
    changePassword: null,
    changeSocial: null,
  },
};
const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.USER_INFO_REQUEST: {
      return {
        ...state,
        loadings: {...state.loadings, user: true},
        errors: {...state.errors, user: null},
      };
    }
    case ActionTypes.USER_INFO_SUCCESS: {
      const user = action.payload;
      return {
        ...state,
        loadings: {...state.loadings, user: false},
        errors: {...state.errors, user: null},
        user,
      };
    }
    case ActionTypes.USER_INFO_ERROR: {
      return {
        ...state,
        loadings: {...state.loadings, user: false},
        errors: {...state.errors, user: action.payload},
      };
    }
    case ActionTypes.USER_KURER_INFO_REQUEST: {
      return {
        ...state,
        loadings: {...state.loadings, kurer: true},
        errors: {...state.errors, kurer: null},
      };
    }
    case ActionTypes.USER_KURER_INFO_SUCCESS: {
      const user = action.payload;
      return {
        ...state,
        loadings: {...state.loadings, kurer: false},
        errors: {...state.errors, kurer: null},
        user,
      };
    }
    case ActionTypes.USER_KURER_INFO_ERROR: {
      return {
        ...state,
        loadings: {...state.loadings, kurer: false},
        errors: {...state.errors, kurer: action.payload},
      };
    }
    case ActionTypes.CHANGE_USER_INFO_REQUEST: {
      return {
        ...state,
        loadings: {...state.loadings, changeUserInfo: true},
        errors: {...state.errors, changeUserInfo: null},
      };
    }
    case ActionTypes.CHANGE_USER_INFO_SUCCESS: {
      return {
        ...state,
        user: action.payload,
        loadings: {...state.loadings, changeUserInfo: false},
        errors: {...state.errors, changeUserInfo: null},
      };
    }
    case ActionTypes.CHANGE_USER_INFO_ERROR: {
      return {
        ...state,
        loadings: {...state.loadings, changeUserInfo: false},
        errors: {...state.errors, changeUserInfo: action.payload},
      };
    }
    case ActionTypes.CHANGE_PASSWORD_REQUEST: {
      return {
        ...state,
        loadings: {...state.loadings, changePassword: true},
        errors: {...state.errors, changePassword: null},
      };
    }
    case ActionTypes.CHANGE_PASSWORD_SUCCESS: {
      return {
        ...state,
        loadings: {...state.loadings, changePassword: false},
        errors: {...state.errors, changePassword: null},
      };
    }
    case ActionTypes.CHANGE_PASSWORD_ERROR: {
      return {
        ...state,
        loadings: {...state.loadings, changePassword: false},
        errors: {...state.errors, changePassword: action.payload},
      };
    }
    case ActionTypes.CHANGE_SOCIAL_REQUEST: {
      return {
        ...state,
        loadings: {...state.loadings, changeSocial: true},
        errors: {...state.errors, changeSocial: null},
      };
    }
    case ActionTypes.CHANGE_SOCIAL_SUCCESS: {
      const user = action.payload;
      return {
        ...state,
        loadings: {...state.loadings, changeSocial: false},
        errors: {...state.errors, changeSocial: null},
        user,
      };
    }
    case ActionTypes.CHANGE_SOCIAL_ERROR: {
      return {
        ...state,
        loadings: {...state.loadings, changeSocial: false},
        errors: {...state.errors, changeSocial: action.payload},
      };
    }
    case AuthActionTypes.SIGN_OUT_REQUEST:
    case AuthActionTypes.SIGN_OUT_SUCCESS:
    case AuthActionTypes.SIGN_OUT_ERROR: {
      return initialState;
    }
    default:
      return state;
  }
};
export default appReducer;
