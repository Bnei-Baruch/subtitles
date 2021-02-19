import React from 'react';
import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableRow, } from '@material-ui/core';

import TableToolbar from './TableToolbar';
import TableHead from './TableHead';

import useStyles from './stylesTableSlides';
import { useDispatch, useSelector } from 'react-redux';
import { setSelected as setSelectedSlides } from '../../actions/subtitles';

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

const headCells = [
  { id: 'title', numeric: false, disablePadding: true, label: 'Title of the Study Material' },
  { id: 'createdAt', numeric: true, disablePadding: false, label: 'Created At' },
];

const isSelected = (title, selected) => selected.indexOf(title) !== -1;

const TableSlides = ({ deleteCallback }) => {
  const [order, setOrder]     = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('title');
  const books                 = useSelector((state) => state.subtitles.books);
  const selected              = useSelector((state) => state.subtitles.selected);
  const setSelected           = (selected) => dispatch(setSelectedSlides(selected));
  const dispatch              = useDispatch();
  const classes               = useStyles();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    const newSelected = event.target.checked ? books.map((n) => n.id) : [];
    setSelected(newSelected);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected     = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableToolbar numSelected={selected.length} deleteCallback={() => {
          deleteCallback(selected);
          setSelected([]);
        }} />
        <TableContainer>
          <Table className={classes.table} size="small">
            <TableHead
              headCells={headCells}
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={books.length}
            />
            <TableBody>
              {stableSort(books, getComparator(order, orderBy)).map((row, index) => {
                const isItemSelected = isSelected(row.id, selected);
                const labelId        = `table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={`${row.id}-${row.title}`}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} />
                    </TableCell>
                    <TableCell component="td" id={labelId} scope="row" padding="none">{row.title}</TableCell>
                    <TableCell align="right">{row.createdAt}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default TableSlides;
