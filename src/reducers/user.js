import actionTypes from '../constants/actionTypes';

const INITIAL_STATE = {
  sending: 0,
  smsTime: 60,
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
    case actionTypes.USER_CODE:
      return {...state, ...action.payload};
    default:
      return state;
  }
}
