import React, { useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

import useStyles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { setLang } from '../../actions/language';
import { CLEAR_MSG, languages, ON_AIR_MSG } from '../../constants/consts';
import { getMqttEmitter, join } from '../../helpers/send';
import { SELECT_SLIDE_SUCCESS, SET_BROADCAST, SET_CURRENT_BOOK } from '../../constants/actionTypes';

const LanguageSelector = () => {
  const language = useSelector((state) => state.language.language);
  const dispatch = useDispatch();
  const classes  = useStyles();

  useEffect(() => {
    initSubscriber();
  }, [language]);

  const initSubscriber = async () => {
    dispatch({ type: SET_CURRENT_BOOK, bookId: -1 });
    const mq = await getMqttEmitter();
    join(language);
    console.log('initSubscriber: ', language);
    mq.on('message', (topic, json, packet) => {
      const data = JSON.parse(json);
      console.log('[mqtt] Call on message: ', data, topic, data.message === CLEAR_MSG, data.message === ON_AIR_MSG);
      mq.emit('MqttSubtitlesEvent', json);
      if (data.message === CLEAR_MSG)
        dispatch({ type: SET_BROADCAST, broadcast: false });
      else if (data.message === ON_AIR_MSG)
        dispatch({ type: SET_BROADCAST, broadcast: true });
      else {
        dispatch({ type: SET_BROADCAST, broadcast: true });
        dispatch({ type: SELECT_SLIDE_SUCCESS, payload: data });
      }
    });
  };

  const handleChange = (event) => dispatch(setLang(event.target.value));

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel>Language</InputLabel>
      <Select
        value={language}
        onChange={handleChange}
        label="Language"
      >
        {
          languages.map(({ key, name }) => {
            return <MenuItem key={key} value={key}>{name}</MenuItem>;
          })
        }
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
