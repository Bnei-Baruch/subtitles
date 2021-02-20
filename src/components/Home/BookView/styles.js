import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  root: {
    width: 100,
  },
  paper: {
    marginBottom: theme.spacing(2),
  },
  rtl: {
    direction: 'rtl',
  },
  preview: {},
  vAlign: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    height: 4 * theme.spacing(3),
    '& h3': {
      margin: '0 0 0 1em',
      lineHeight: '1em',
      fontSize: '1.4em',
      textAlign: 'center',
    },
    '& h4': {
      margin: '0 0 0 1em',
      lineHeight: '1em',
      fontSize: '1.0em',
      textAlign: 'center',
    },
    '& h5': {
      margin: '0 0 0 1em',
      lineHeight: '1em',
      fontSize: '0.8em',
      textAlign: 'center',
    },
    '& .source': {
      marginTop: '0.3em',
      fontSize: 'smaller',
      fontStyle: 'italic',
      borderTop: '3px solid',
      display: 'inline-block',
      width: '100%',
      paddingTop: '0.25em',
      textAlign: 'left',
    },
  },
}));
