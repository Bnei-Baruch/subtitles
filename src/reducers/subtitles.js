import * as actionType from '../constants/actionTypes';

const initialState = {
  broadcast: false,
  books: [],
  selected: [],
};

const subtitlesReducer = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
  case actionType.SET_BROADCAST:
    return { ...state, broadcast: action.broadcast };
  case actionType.ADD_FILE:
    const { file } = action;
    return { ...state, books: [...state.books, file] };
  case actionType.DELETE_FILES:
    const { names } = action;
    const rows      = state.books.filter(row => !names.includes(row.name));
    return { ...state, rows };
  case actionType.SET_SELECTED:
    return { ...state, selected: action.selected };
  default:
    return state;
  }
};

export default subtitlesReducer;
