import { Button, FormControl } from '@material-ui/core';

import useStyles from './styles';
import React from 'react';
import clsx from 'clsx';

const OnOffSwitch = ({ broadcast, handleBroadcast }) => {
  const classes = useStyles();

  return (
    <FormControl variant="outlined" className={classes.onOff}>
      <Button
        variant="contained"
        className={clsx({
          [classes.onOffAir]: true,
          [classes.offAir]: !broadcast,
        })}
        size='large'
        onClick={handleBroadcast}
      >
        {broadcast ? 'On Air ' : 'Off Air'}
      </Button>
    </FormControl>
  );
};

export default OnOffSwitch;
