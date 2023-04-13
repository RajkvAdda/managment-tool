import PropTypes from 'prop-types';
// @mui
import { Box, Checkbox, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';
import { useMemo } from 'react';
import { ActionTableCell, NameTableCell } from './StickyTableCell';

// ----------------------------------------------------------------------

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

Header.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  columns: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func,
  actionCell: PropTypes.bool,
};

export default function Header({
  actionCell,
  order,
  orderBy,
  rowCount,
  columns,
  numSelected,
  onRequestSort,
  onSelectAllClick,
}) {
  const createSortHandler = (property: string) => () => {
    const isAsc = orderBy === property && order === 'asc';
    const sort = isAsc ? `-${property}` : `${property}`;
    onRequestSort(sort);
  };
  const nameIndex = useMemo(() => {
    return columns.findIndex((list) => list?.name === 'name');
  }, [columns]);
  return (
    <TableHead>
      <TableRow>
        <NameTableCell head>
          {onSelectAllClick && (
            <TableCell padding="checkbox" align="left">
              <Checkbox
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={rowCount > 0 && numSelected === rowCount}
                onChange={onSelectAllClick}
              />
            </TableCell>
          )}
          {columns?.slice(0, nameIndex + 1)?.map(({ name, isNumber, label, style }) => (
            <TableCell
              align={isNumber ? 'right' : 'left'}
              key={name}
              sx={{ ...(style ?? {}) }}
              sortDirection={orderBy === name ? order : false}
            >
              <TableSortLabel
                hideSortIcon
                active={orderBy === name}
                direction={orderBy === name ? order : 'asc'}
                onClick={createSortHandler(name)}
              >
                {label}
                {orderBy === name ? (
                  <Box sx={{ ...visuallyHidden }}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </NameTableCell>

        {columns?.slice(nameIndex + 1)?.map(({ name, isNumber, label, style }) => (
          <TableCell
            align={isNumber ? 'right' : 'left'}
            key={name}
            sx={{ whiteSpace: 'nowrap', ...(style ?? {}) }}
            sortDirection={orderBy === name ? order : false}
          >
            <TableSortLabel
              hideSortIcon
              active={orderBy === name}
              direction={orderBy === name ? order : 'asc'}
              onClick={createSortHandler(name)}
            >
              {label}
              {orderBy === name ? (
                <Box sx={{ ...visuallyHidden }}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        {actionCell && (
          <ActionTableCell head align="right">
            {null}
          </ActionTableCell>
        )}
      </TableRow>
    </TableHead>
  );
}
