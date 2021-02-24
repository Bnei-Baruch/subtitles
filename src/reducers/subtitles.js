import * as actionType from '../constants/actionTypes';

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
    const { broadcast } = action;
    console.log('subtitlesReducer action: ', action);
    return { ...state, broadcast };
  case actionType.ADD_BOOK:
    const { book } = action;
    return { ...state, books: [...state.books, book] };
  case actionType.DELETE_BOOKS:
    const { ids } = action;
    const books   = state.books.filter(book => !ids.includes(book.id));
    return { ...state, books };
  case actionType.SET_SELECTED_BOOK:
    return { ...state, selected: action.selected };
  case actionType.SET_CURRENT_BOOK:
    const { bookId }  = action;
    const currentBook = state.books.filter((book) => book.id === bookId);
    return { ...state, currentBook: currentBook?.[0] };
  default:
    return state;
  }
};

export default subtitlesReducer;
