import * as actionType from '../constants/actionTypes';

const authReducer = (state = { user: null, loading: true, disabled: true, }, action) => {
  const { type, user } = action;

  switch (type) {
  case actionType.SET_USER:
    return { ...state, user, loading: false, disabled: false, };
  case actionType.LOGOUT:
    return { ...state, user: null, loading: false, };
  default:
    return state;
  }
};

export default authReducer;
