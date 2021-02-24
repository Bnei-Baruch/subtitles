import * as actionType from '../constants/actionTypes';

const langReducer = (state = { language: localStorage.getItem('lang') || 'en' }, action) => {
  const { type, language } = action;

  switch (type) {
  case actionType.SET_LANG:
    localStorage.setItem('lang', language);
    return { ...state, language };
  default:
    return state;
  }
};

export default langReducer;
