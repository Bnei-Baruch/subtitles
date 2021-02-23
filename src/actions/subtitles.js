import { ADD_BOOK, DELETE_BOOKS, SET_BROADCAST, SET_CURRENT_BOOK, SET_SELECTED_BOOK } from '../constants/actionTypes';

export const setBroadcast = () => async (dispatch) => {
  try {
    dispatch({ type: SET_BROADCAST });
  } catch (error) {
    console.log(error);
  }
};

export const deleteRows = (ids) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_BOOKS, ids });
  } catch (error) {
    console.log(error);
  }
};

export const addFile = (book) => async (dispatch) => {
  try {
    dispatch({ type: ADD_BOOK, book });
    // axios
    //   .post('//localhost:4000/', {
    //     title: book.title,
    //     content: book.content,
    //   })
    //   .then(res => {
    //     book.id = res.data;
    //     dispatch({ type: ADD_BOOK, book });
    //     console.log('Book added: ', res.data);
    //   })
    //   .catch(err => {
    //     alert(`Book not added: ${err.message}`);
    //   });
  } catch (error) {
    console.log(error);
  }
};

export const setSelected = (selected = []) => async (dispatch) => {
  try {
    dispatch({ type: SET_SELECTED_BOOK, selected });
  } catch (error) {
    console.log(error);
  }
};

export const setCurrentBook = (bookId) => async (dispatch) => {
  try {
    dispatch({ type: SET_CURRENT_BOOK, bookId });
  } catch (error) {
    console.log(error);
  }
};
