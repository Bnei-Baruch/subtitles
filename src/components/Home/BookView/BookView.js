import { Card, Container } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import DOMPurify from 'dompurify';
import clsx from 'clsx';

import useStyles from './styles';
import { selectSlide } from '../../../actions/selectSlide';

const BookView = () => {
  const currentBook  = useSelector((state) => state.subtitles.currentBook);
  const language     = useSelector((state) => state.language.language);
  const currentSlide = useSelector((state) => state.slide.selectedByLang[language]);
  const broadcast    = useSelector((state) => state.subtitles.broadcast);
  const dispatch     = useDispatch();
  const classes      = useStyles();
  const content      = currentBook?.content || [];

  const user         = useSelector((state) => state.auth.user);
  const handleSelect = slide => dispatch(selectSlide({ slide, lang: language, user, broadcast }));

  return (
    <Container className={clsx(classes.preview, {
      [classes.rtl]: language === 'he',
    })} maxWidth="md" disableGutters>
      {
        content.map((slide) => {
          const key = `${slide.page}-${slide.letter}-${slide.subletter}-${slide.revert}`;
          return (
            <Card
              key={key}
              className={clsx(classes.slide, {
                [classes.vAlign]: slide.isH,
                [classes.selected]: currentSlide?.key === key
              })}
              onClick={() => handleSelect({ ...slide, key })}
            >
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(slide.content) }}></div>
            </Card>
          );
        })
      }
    </Container>
  );
};

export default BookView;
