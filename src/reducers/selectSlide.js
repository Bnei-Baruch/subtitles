import { SELECT_SLIDE_SUCCESS } from '../constants/actionTypes';

const slideReducer = (state = { selectedByLang: {} }, { type, payload = {} }) => {
  switch (type) {
  case SELECT_SLIDE_SUCCESS:
    const { lang, slide } = payload;
    let selectedByLang    = { ...state.selectedByLang };
    selectedByLang[lang]  = slide;
    return { ...state, selectedByLang };
  default:
    return state;
  }
};
export default slideReducer;
