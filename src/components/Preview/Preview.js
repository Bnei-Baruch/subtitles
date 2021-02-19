import { Card, Container, Paper, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import DOMPurify from 'dompurify';

import useStyles from './styles';
import clsx from 'clsx';

const Preview = () => {
  const selected = useSelector((state) => state.subtitles.selected);
  const books    = useSelector((state) => state.subtitles.books);
  const language = useSelector((state) => state.language.language);
  const classes  = useStyles();

  if (selected.length !== 1) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">Select Book to Preview Slides</Typography>
      </Paper>
    );
  }

  const book = books.filter((book) => book.id === selected[0])[0];

  return (
    <>
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">{book.title}</Typography>
      </Paper>
      <Container className={clsx(classes.preview, {
        [classes.rtl]: language === 'he',
      })} maxWidth="md" disableGutters>
        {
          book.content.map((slide) => {
            const key = `${slide.page}-${slide.letter}-${slide.subletter}-${slide.revert}`;
            return (
              <Card key={key} className={clsx(classes.slide, {
                [classes.vAlign]: slide.isH,
              })} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(slide.content) }} />
            );
          })
        }
      </Container>
    </>
  );
};

export default Preview;
