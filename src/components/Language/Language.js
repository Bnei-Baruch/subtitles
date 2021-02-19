import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

import useStyles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { setLang } from '../../actions/language';
import { languages } from '../../constants/consts';

const LanguageSelector = () => {
  const language = useSelector((state) => state.language.language);
  const dispatch = useDispatch();
  const classes  = useStyles();

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
