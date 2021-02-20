import { Button, Container, Grid, Grow, Paper, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import TableSlides from './TableSlides';
import { addFile as af, deleteRows as dr } from '../../actions/subtitles';
import { useEditStyles } from './stylesTableSlides';
import { parseFile } from '../../helpers/parseFile';
import Preview from './Preview/Preview';

const setNewFiles = async (files, addFile) => {
  Array.from(files).forEach((fileName) => {
    let reader = new FileReader();
    reader.readAsText(fileName);
    reader.onload = () => {
      const [file, err] = parseFile(reader.result);

      if (err.length !== 0) {
        alert(`Parsing error(s) for ${fileName}: ${err}`);
        return;
      }
      addFile(file);
    };
  });
};

const deleteCallback = (names, deleteRows) => deleteRows(names);

const Edit = () => {
  const user       = useSelector((state) => state.auth.user);
  const addFile    = (file) => dispatch(af(file));
  const deleteRows = (names) => dispatch(dr(names));
  const dispatch   = useDispatch();
  const classes    = useEditStyles();

  if (!user) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          Please Sign In to Edit Slides.
        </Typography>
      </Paper>
    );
  }

  return (
    <Grow in>
      <Container>
        <Grid container justify="space-between" alignItems="stretch" spacing={3}>
          <Grid item xs={12} sm={7}>
            <TableSlides deleteCallback={(names) => deleteCallback(names, deleteRows)} />
          </Grid>
          <Grid item xs={12} sm={5}>
            <Paper className={classes.paper}>
              <Button variant="contained" className={classes.fileInput} component="label">
                Upload New Subtitles
                <input type="file" hidden multiple onChange={(e) => setNewFiles(e.target.files, addFile)} />
              </Button>
            </Paper>
            <Preview />
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Edit;
