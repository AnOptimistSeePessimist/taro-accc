import actionTypes from '@constants/actionTypes';

const INITIAL_STATE = [];

export default function compWorkType(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.COMP_WORK_TYPE: 
      return action.payload;
    default:
      return state;
  }
}
