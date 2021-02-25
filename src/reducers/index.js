import { combineReducers } from 'redux';

import auth from './auth';
import language from './language';
import subtitles from './subtitles';
import slide from './selectSlide';

export const reducers = combineReducers({ auth, language, subtitles, slide });
