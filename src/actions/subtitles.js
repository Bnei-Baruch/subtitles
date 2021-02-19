import { ADD_FILE, DELETE_FILES, SET_BROADCAST, SET_SELECTED } from '../constants/actionTypes';

export const setBroadcast = (broadcast) => async (dispatch) => {
  try {
    dispatch({ type: SET_BROADCAST, broadcast });
  } catch (error) {
    console.log(error);
  }
};

export const deleteRows = (names) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_FILES, names });
  } catch (error) {
    console.log(error);
  }
};

export const addFile = (file) => async (dispatch) => {
  try {
    dispatch({ type: ADD_FILE, file });
  } catch (error) {
    console.log(error);
  }
};

export const setSelected = (selected = []) => async (dispatch) => {
  try {
    dispatch({ type: SET_SELECTED, selected });
  } catch (error) {
    console.log(error);
  }
};
