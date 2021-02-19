import { SET_LANG } from '../constants/actionTypes';

export const setLang = (language) => async (dispatch) => {
  try {
    dispatch({ type: SET_LANG, language });
  } catch (error) {
    console.log(error);
  }
};
