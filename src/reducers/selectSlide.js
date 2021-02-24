import { SELECT_SLIDE_SUCCESS } from '../constants/actionTypes';

const slideReducer = (state = { selectedByLang: {} }, { type, payload = {} }) => {
  switch (type) {
  case SELECT_SLIDE_SUCCESS:
    const { language, message: slide } = payload;
    let selectedByLang                 = { ...state.selectedByLang };
    selectedByLang[language]           = slide;
    console.log('slideReducer SELECT_SLIDE_SUCCESS payload: ', payload, slide, language, state.selectedByLang);
    return { ...state, selectedByLang };
  default:
    return state;
  }
};
export default slideReducer;
