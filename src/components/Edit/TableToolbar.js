import React from 'react';
import * as PropTypes from 'prop-types';
import clsx from 'clsx';

import { IconButton, Toolbar, Tooltip, Typography, } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import { useToolbarStyles } from './stylesTableSlides';

const TableToolbar = ({ numSelected, deleteCallback }) => {
  const classes = useToolbarStyles();

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">{numSelected} selected</Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">Subtitles</Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete"><IconButton aria-label="delete" onClick={deleteCallback}><DeleteIcon /></IconButton></Tooltip>
      ) : (
        <Tooltip title="Filter list"><IconButton aria-label="filter list">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z" />
          </svg>
        </IconButton></Tooltip>
      )}
    </Toolbar>
  );
};

TableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default TableToolbar;
