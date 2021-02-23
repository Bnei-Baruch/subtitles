import { SELECT_SLIDE_SUCCESS } from '../constants/actionTypes';
import { send } from '../helpers/send';

export const selectSlide = ({ slide, lang, retain = true, broadcast }) => async (dispatch) => {
  try {
    const { content } = slide;
    broadcast && await send(content, retain, lang);
    dispatch({ type: SELECT_SLIDE_SUCCESS, payload: { lang, slide } });
  } catch (error) {
    console.log(error);
  }
};

