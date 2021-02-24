import React, { useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { AppBar, Button, CircularProgress, Toolbar, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import useStyles from './styles';
import { getUser, signIn, signOut } from '../../actions/auth';
import LanguageSelector from '../Language/Language';
import OnOffSwitch from '../Onoff/Onoff';
import { setBroadcast } from '../../actions/subtitles';
import clsx from 'clsx';

const Navbar = () => {
  const user         = useSelector((state) => state.auth.user);
  const loading      = useSelector((state) => state.auth.loading);
  const disabled     = useSelector((state) => state.auth.disabled);
  const broadcast    = useSelector((state) => state.subtitles.broadcast);
  const language     = useSelector((state) => state.language);
  const currentSlide = useSelector((state) => state.slide.selectedByLang[language.language]);
  const dispatch     = useDispatch();
  const classes      = useStyles();
  const history      = useHistory();
  const location     = useLocation();

  const userLogin = () => dispatch(signIn(language.language));

  const userLogout = () => dispatch(signOut());

  const edit   = () => history.push('/edit');
  const main   = () => history.push('/');
  const inEdit = location.pathname === '/edit';

  const handleBroadcast = (event) => dispatch(setBroadcast(language.language, broadcast, currentSlide));

  useEffect(() => dispatch(getUser()), [dispatch]);

  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
      <div className={classes.brandContainer}>
        <Typography component={Link} to="/" className={classes.heading} variant="h2" align="center">Subtitles</Typography>
        {loading && <CircularProgress variant='indeterminate' />}
        {
          user && (
            <>
              <LanguageSelector /><OnOffSwitch broadcast={broadcast} handleBroadcast={handleBroadcast} />
            </>
          )
        }
      </div>

      <Toolbar className={classes.toolbar}>
        {user ? (
          <>
            <Button
              variant="contained"
              className={clsx(classes.margin, classes.button)}
              color="primary"
              onClick={inEdit ? main : edit}
            >
              {inEdit ? 'Main' : 'Edit'}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => userLogout()}
              className={classes.button}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button variant="contained" color="primary" disabled={disabled} onClick={() => userLogin()}>Sign In</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
