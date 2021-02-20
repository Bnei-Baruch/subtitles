import * as actionType from '../constants/actionTypes';
import { SET_CURRENT_BOOK } from '../constants/actionTypes';

const initialState = {
  broadcast: false,
  books: [],
  selected: [],
  currentBook: null,
};

const subtitlesReducer = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
  case actionType.SET_BROADCAST:
    return { ...state, broadcast: !state.broadcast };
  case actionType.ADD_FILE:
    const { file } = action;
    return { ...state, books: [...state.books, file] };
  case actionType.DELETE_FILES:
    const { names } = action;
    const rows      = state.books.filter(row => !names.includes(row.name));
    return { ...state, rows };
  case actionType.SET_SELECTED:
    return { ...state, selected: action.selected };
  case actionType.SET_CURRENT_BOOK:
    const { bookId } = action;
    const currentBook = state.books.filter((book) => book.id === bookId);
    return { ...state, currentBook: currentBook?.[0] };
  default:
    return state;
  }
};

export default subtitlesReducer;
