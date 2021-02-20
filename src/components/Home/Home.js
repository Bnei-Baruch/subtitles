import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Grow, Paper, Typography } from '@material-ui/core';

import useStyles from './styles';
import SelectBook from './SelectBook/SelectBook';
import BookView from './BookView/BookView';

const Home = () => {
  const user  = useSelector((state) => state.auth.user);
  const classes  = useStyles();

  if (!user) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          Please Sign In to Work with Slides.
        </Typography>
      </Paper>
    );
  }

  return (
    <Grow in>
      <Container>
        <Grid container justify="space-between" alignItems="stretch" spacing={3}>
          <Grid item xs={12} sm={5}>
            <div>Search bar</div>
            <div>Bookmarks</div>
            <div>Player</div>
          </Grid>
          <Grid item xs={12} sm={7}>
            <SelectBook />
            <BookView />
          </Grid>
        </Grid>
      </Container>
    </Grow>

  );
};

export default Home;
