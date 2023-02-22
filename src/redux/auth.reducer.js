import * as ActionTypes from '../constants/auth.constants';
import {getAccessToken} from '../utils';

const initialState = {
  loadings: {
    isAuthenticated: false,
    signIn: false,
    inviter: false,
  },
  errors: {
    signIn: null,
    inviter: null,
    isAuthenticated: null,
  },
};
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SIGN_IN_REQUEST: {
      return {
        ...state,
        loadings: {...state.loadings, signIn: true},
        errors: {...state.errors, signIn: null},
      };
    }
    case ActionTypes.SIGN_IN_SUCCESS: {
      return {
        ...state,
        isAuthenticated: getAccessToken(),
        loadings: {...state.loadings, signIn: false},
        errors: {...state.errors, signIn: null},
      };
    }
    case ActionTypes.SIGN_IN_ERROR: {
      return {
        ...state,
        isAuthenticated: false,
        loadings: {...state.loadings, signIn: false},
        errors: {...state.errors, signIn: action.payload},
      };
    }
    case ActionTypes.SIGN_OUT_REQUEST:
    case ActionTypes.SIGN_OUT_SUCCESS:
    case ActionTypes.SIGN_OUT_ERROR: {
      return initialState;
    }

    default:
      return state;
  }
};
export default authReducer;
