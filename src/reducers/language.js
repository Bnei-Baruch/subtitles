import * as actionType from '../constants/actionTypes';

const langReducer = (state = { language: 'en' }, action) => {
  const { type, language } = action;

  switch (type) {
  case actionType.SET_LANG:
    return { ...state, language };
  default:
    return state;
  }
};

export default langReducer;
