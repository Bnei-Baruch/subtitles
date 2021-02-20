import { Card, Container } from '@material-ui/core';
import { useSelector } from 'react-redux';
import DOMPurify from 'dompurify';
import clsx from 'clsx';

import useStyles from './styles';

const BookView = () => {
  const currentBook = useSelector((state) => state.subtitles.currentBook);
  const language    = useSelector((state) => state.language.language);
  const classes     = useStyles();

  const content = currentBook?.content || [];

  return (
    <Container className={clsx(classes.preview, {
      [classes.rtl]: language === 'he',
    })} maxWidth="md" disableGutters>
      {
        content.map((slide) => {
          const key = `${slide.page}-${slide.letter}-${slide.subletter}-${slide.revert}`;
          return (
            <Card key={key} className={clsx(classes.slide, {
              [classes.vAlign]: slide.isH,
            })} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(slide.content) }} />
          );
        })
      }
    </Container>
  );
};

export default BookView;
