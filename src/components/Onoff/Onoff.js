import { FormControl, Grid, Switch } from '@material-ui/core';

import useStyles from './styles';
import React from 'react';

const OnOffSwitch = ({ broadcast, handleBroadcast }) => {
  const classes = useStyles();

  return (
    <FormControl variant="outlined" className={classes.onOff}>
      <Grid component="label" container alignItems="center" spacing={1}>
        <Grid item>Off</Grid>
        <Grid item>
          <Switch classes={classes} checked={broadcast} onChange={handleBroadcast} name="broadcast" />
        </Grid>
        <Grid item>On</Grid>
      </Grid>
    </FormControl>
  );
};

export default OnOffSwitch;
