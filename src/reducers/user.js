import actionTypes from '../constants/actionTypes';

const INITIAL_STATE = {
  userInfo: {
    login: false,
  },
};

export default function user(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.USER_LOGIN:
      return {
        ...state,
        userInfo: {
          ...action.payload,
          login: true,
        },
      };
    case actionTypes.USER_INFO:
      return {...state};
    case actionTypes.USER_LOGOUT:
      return {...INITIAL_STATE};
    default:
      return state;
  }
}
