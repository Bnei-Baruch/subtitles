import { SELECT_SLIDE_SUCCESS } from '../constants/actionTypes';
import { send } from '../helpers/send';

export const selectSlide = ({ slide, language, retain = true, broadcast }) => async (dispatch) => {
  try {
    broadcast && await send(slide, retain, language);
    dispatch({ type: SELECT_SLIDE_SUCCESS, payload: { language, message: slide } });
  } catch (error) {
    console.log(error);
  }
};

