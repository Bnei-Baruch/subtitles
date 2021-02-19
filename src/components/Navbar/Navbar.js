import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AppBar, Button, CircularProgress, Toolbar, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import useStyles from './styles';
import { getUser, signIn, signOut } from '../../actions/auth';
import LanguageSelector from '../Language/Language';
import OnOffSwitch from '../Onoff/Onoff';
import { setBroadcast } from '../../actions/subtitles';

const Navbar = () => {
  const user      = useSelector((state) => state.auth.user);
  const loading   = useSelector((state) => state.auth.loading);
  const disabled  = useSelector((state) => state.auth.disabled);
  const broadcast = useSelector((state) => state.subtitles.broadcast);
  const dispatch  = useDispatch();
  const classes   = useStyles();
  const history   = useHistory();

  const userLogin = () => dispatch(signIn(window.location.href));

  const userLogout = () => dispatch(signOut());

  const edit = () => history.push('/edit');

  const handleBroadcast = (event) => dispatch(setBroadcast(event.target.checked));

  useEffect(() => dispatch(getUser()), [dispatch]);

  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
      <div className={classes.brandContainer}>
        <Typography component={Link} to="/" className={classes.heading} variant="h2" align="center">Subtitles</Typography>
        {loading && <CircularProgress variant='indeterminate' />}
      </div>
      <Toolbar className={classes.toolbar}>
        {user ? (
          <>
            <OnOffSwitch broadcast={broadcast} handleBroadcast={handleBroadcast} />
            <LanguageSelector />
            <Button variant="contained" className={classes.margin} color="primary" onClick={() => edit()}>Edit</Button>
            <Button variant="contained" color="secondary" onClick={() => userLogout()} className={classes.logout}>Logout</Button>
          </>
        ) : (
          <Button variant="contained" color="primary" disabled={disabled} onClick={() => userLogin()}>Sign In</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
