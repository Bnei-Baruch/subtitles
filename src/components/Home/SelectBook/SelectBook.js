import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Menu, MenuItem, Paper, Typography } from '@material-ui/core';
import clsx from 'clsx';

import useStyles from './styles';
import { setCurrentBook as scb } from '../../../actions/subtitles';

const ITEM_HEIGHT = 48;

const SelectBook = () => {
  const books          = useSelector((state) => state.subtitles.books);
  const language       = useSelector((state) => state.language.language);
  const currentBook    = useSelector((state) => state.subtitles.currentBook);
  const setCurrentBook = (selected) => dispatch(scb(selected));
  const dispatch       = useDispatch();

  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open                    = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (event, bookId) => {
    setCurrentBook(bookId);
    setAnchorEl(null);
  };

  return (
    <Paper className={clsx(classes.paper, {
      [classes.rtl]: language === 'he',
    })}>
      <Button
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        {currentBook?.title || 'Select book'}
      </Button>
      <Menu
        className={clsx({
          [classes.rtl]: language === 'he',
        })}
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '150ch',
          },
        }}
      >
        {books.map((book) => (
          <MenuItem key={book.id} selected={book.id === currentBook?.id} onClick={(event) => handleMenuItemClick(event, book.id)}>
            <Typography variant="inherit" noWrap>{book.title}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  );
};

export default SelectBook;

