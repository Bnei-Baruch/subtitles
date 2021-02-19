import { LOGOUT, SET_USER } from '../constants/actionTypes';
import { getUser as kcGetUser, kc } from '../components/UserManagement/UserManagement';

export const signIn = (user, redirectUri) => async (dispatch) => {
  try {
    kc.login({ redirectUri });

    dispatch({ type: SET_USER, user });
  } catch (error) {
    console.log(error);
  }
};

export const signOut = () => async (dispatch) => {
  try {
    kc.logout();
    dispatch({ type: LOGOUT });
  } catch (error) {
    console.log(error);
  }
};

export const getUser = () => async (dispatch) => {
  try {
    kcGetUser((user) => {
      dispatch({ type: SET_USER, user });
    });
  } catch (error) {
    console.log(error);
  }
};
