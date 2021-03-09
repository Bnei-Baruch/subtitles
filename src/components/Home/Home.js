import { useSelector } from 'react-redux';
import { Container, Grid, Grow, Paper, Typography } from '@material-ui/core';

import useStyles from './styles';
import SelectBook from './SelectBook/SelectBook';
import BookView from './BookView/BookView';
import GalaxyStream from '../../gxy/shared/GalaxyStream';
import VirtualStreaming from '../../gxy/shared/VirtualStreaming';

const Home = () => {
  const user       = useSelector((state) => state.auth.user);
  const playerLang = useSelector((state) => state.language.language);
  const classes    = useStyles();
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
            <div className="vclient__main">
              <div className={'vclient__main-wrapper no-of-videos-1 layout--split with-kli-olami broadcast--on broadcast--inline'}>
                <div className="broadcast-panel">
                  <div className="broadcast__wrapper">
                    <VirtualStreaming playerLang={playerLang} user={user} />
                  </div>
                </div>
              </div>
            </div>
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
