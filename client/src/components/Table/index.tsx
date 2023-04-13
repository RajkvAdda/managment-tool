import { ReactNode, useState, FC, useEffect, useMemo } from 'react';
// @mui
import {
  Card,
  Table as MuiTable,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination,
  TableProps,
  PaginationProps,
  Checkbox,
  Popover,
  MenuItem,
  Stack,
} from '@mui/material';
// components
import Iconify from '../iconify';
import Scrollbar from '../scrollbar';
// sections
import HeaderToolBar from './HeaderToolBar';
import Header from './Header';
import { DeleteIconButton, IconButton } from '../IconButtons';
import { DeleteConfirmModal } from '../Modal';
import MasterFilter from '../MsterFilter';
import { ActionTableCell, NameTableCell } from './StickyTableCell';

// ----------------------------------------------------------------------

export interface ColumnI {
  name: any;
  label: string;
  style?: object;
  format?: (value: any, list?: any) => any;
  isNumber?: boolean;
  defaultValue?: string;
}

// ----------------------------------------------------------------------

interface TableI {
  tableProps?: TableProps;
  columns: ColumnI[];
  rows: any[];
  isLoading?: boolean;
  row?: (row: any, index: number) => ReactNode;
  modalTable?: boolean;
  paginationProps?: PaginationProps | any;
  sorting?: string;
  tableHead?: ReactNode;
  filter: {
    page: number;
    limit: number;
    sort: string;
    search: object;
  };
  masterFilter: any;
  onSelectAll: any;
  setFilter: any;
  selectList: any[];
  setSelectList: any;
  onEditClick: any;
  onDeleteClick: any;
  deleteState: any;
  caption: any;
  action: any;
}

//
const Table: FC<TableI> = ({
  tableProps,
  columns,
  rows,
  modalTable,
  row,
  isLoading,
  onSelectAll,
  paginationProps,
  filter,
  setFilter,
  selectList,
  setSelectList,
  tableHead,
  onEditClick,
  onDeleteClick,
  deleteState,
  caption,
  action,
  masterFilter,
}) => {
  const [open, setOpen] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(null);
  const [openRow, setOpenRow] = useState(null);
  console.log('rows', rows);

  useEffect(() => {
    if (deleteState?.isSuccess && selectList?.length > 0) {
      setSelectList(() => []);
    }
  }, [deleteState]);

  // ========= Master Filter state ============//
  const [filterState, setfilterState] = useState(null);
  const onMasterFilterChange = (name: any, value: any, comparison: any, logical: string | number) => {
    setfilterState((prev) => ({
      ...(prev ?? {}),
      [logical]: {
        ...(prev?.[logical] ?? {}),
        [name]: {
          [comparison]: value,
        },
      },
    }));
  };

  const nameIndex = useMemo(() => {
    return columns.findIndex((list) => list?.name === 'name');
  }, [columns]);
  return (
    <>
      <Card>
        <HeaderToolBar
          numSelected={selectList?.length ?? 0}
          {...(masterFilter
            ? {
                masterFilter: masterFilter?.state ?? {},
                onDeleteFilter: onMasterFilterChange,
              }
            : {})}
          {...(filter?.search
            ? {
                filterName: filter?.search?.name,
                onFilterName: (e) => {
                  e.preventDefault();
                  console.log('chan');
                  setFilter((prev) => ({
                    ...prev,
                    page: 1,
                    search: {
                      ...(prev?.search ?? {}),
                      name: e.target.value,
                    },
                  }));
                },
              }
            : {})}
        >
          {selectList?.length > 0 ? (
            <DeleteIconButton
              isDelete
              actionState={deleteState}
              onConfirm={() => {
                onDeleteClick(null, selectList);
              }}
            />
          ) : (
            <Stack>
              {action ?? null}
              {masterFilter && (
                <MasterFilter
                  onChange={onMasterFilterChange}
                  formState={filterState}
                  setFilterState={setfilterState}
                  {...(masterFilter ?? {})}
                />
              )}
            </Stack>
          )}
        </HeaderToolBar>
        <Scrollbar>
          <TableContainer sx={{ height: paginationProps ? 410 : 465 }}>
            <MuiTable
              sx={
                isLoading
                  ? {
                      borderSpacing: '0.7rem',
                    }
                  : {}
              }
              stickyHeader
              {...tableProps}
            >
              {caption && <caption>{caption}</caption>}
              {tableHead ? (
                tableHead
              ) : (
                <Header
                  actionCell={onEditClick || onDeleteClick}
                  {...(filter?.sort
                    ? {
                        order: filter?.sort?.includes('-') ? 'desc' : 'asc',
                        orderBy: filter?.sort.replace('-', ''),
                        onRequestSort: (sort) => {
                          setFilter((prev) => ({ ...prev, sort }));
                        },
                      }
                    : {})}
                  columns={columns}
                  {...(onSelectAll
                    ? {
                        rowCount: paginationProps?.count ?? rows?.length,
                        numSelected: selectList?.length ?? 0,
                        onSelectAllClick: onSelectAll,
                      }
                    : {})}
                />
              )}
              <TableBody>
                {isLoading ? (
                  Array.from({ length: paginationProps?.limit ?? 6 }, (_, i) => (
                    <TableRow className="skeleton" sx={{ height: '50px' }}>
                      <TableCell colSpan={columns?.length - 1}> </TableCell>
                    </TableRow>
                  ))
                ) : rows?.length === 0 ? (
                  // check is search true
                  filter?.search?.name?.length > 0 ? (
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h5" paragraph>
                            No Record Found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filter?.search?.name}&quot;</strong>.
                            <br /> Try checking for typos or using diffrent words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  ) : (
                    // else no record found
                    <TableRow>
                      <TableCell colSpan={columns?.length}>
                        <Typography variant="h5">No Record Found</Typography>
                      </TableCell>
                    </TableRow>
                  )
                ) : (
                  rows?.map((list, index) => {
                    // ==================
                    if (row) return row(list, index);
                    // ===================
                    return (
                      <TableRow
                        hover
                        key={list?._id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={selectList?.includes(list?._id)}
                      >
                        <NameTableCell>
                          {setSelectList && (
                            <TableCell padding="checkbox" align="left">
                              <Checkbox
                                checked={selectList?.includes(list?._id)}
                                onChange={(e) => {
                                  const { checked } = e.target;
                                  if (checked) {
                                    setSelectList((prev) => [...prev, list?._id]);
                                  } else {
                                    setSelectList((prev) => [...prev?.filter((li) => li !== list?._id)]);
                                  }
                                }}
                              />
                            </TableCell>
                          )}
                          {columns?.slice(0, nameIndex + 1)?.map(({ name, style, isNumber, format, defaultValue }) => (
                            <TableCell
                              defaultValue={defaultValue}
                              align={isNumber ? 'right' : 'left'}
                              key={name}
                              sx={{ ...(style ?? {}) }}
                            >
                              {format ? format(list[name] ?? '', list) : list[name] ?? ''}
                            </TableCell>
                          ))}
                        </NameTableCell>
                        {columns?.slice(nameIndex + 1)?.map(({ name, style, isNumber, format, defaultValue }) => (
                          <TableCell
                            defaultValue={defaultValue}
                            align={isNumber ? 'right' : 'left'}
                            key={name}
                            sx={{ ...(style ?? {}) }}
                          >
                            {format ? format(list[name] ?? '', list) : list[name] ?? ''}
                          </TableCell>
                        ))}
                        {(onEditClick || onDeleteClick) && (
                          <ActionTableCell padding="checkbox" sx={{ pr: 0.5 }} align="right">
                            <IconButton
                              size="large"
                              icon="eva:more-vertical-fill"
                              color="inherit"
                              onClick={(event) => {
                                setOpen(event.currentTarget);
                                setOpenRow(list);
                              }}
                            />
                          </ActionTableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </MuiTable>
          </TableContainer>
        </Scrollbar>
        {paginationProps && (
          <TablePagination
            sx={{ borderTop: (theme) => `1px solid ${theme.palette.grey[200]}` }}
            rowsPerPageOptions={paginationProps?.rowsPerPageOptions ?? [5, 10, 25, 50, 100]}
            component="div"
            count={paginationProps?.count ?? 0}
            rowsPerPage={paginationProps?.rowsPerPage ?? 10}
            page={paginationProps?.page ? paginationProps?.page - 1 : 1}
            onPageChange={(e, newPage) => {
              setFilter((prev: any) => ({ ...prev, page: parseInt(newPage) + 1 }));
            }}
            onRowsPerPageChange={(e) => {
              setFilter((prev: any) => ({ ...prev, page: 1, limit: parseInt(e.target.value, 10) }));
            }}
          />
        )}
      </Card>
      {(onDeleteClick || onEditClick) && (
        <Popover
          open={Boolean(open)}
          anchorEl={open}
          onClose={() => {
            setOpen(null);
            setOpenRow(null);
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              p: 1,
              width: 140,
              '& .MuiMenuItem-root': {
                px: 1,
                typography: 'body2',
                borderRadius: 0.75,
              },
            },
          }}
        >
          {onEditClick && (
            <MenuItem
              sx={{ color: 'primary.main' }}
              onClick={() => {
                onEditClick(openRow);
                setOpen(null);
              }}
            >
              <Iconify icon={'mdi:pencil'} sx={{ mr: 1.5, fontSize: '1.4rem' }} />
              Edit
            </MenuItem>
          )}
          {onDeleteClick && (
            <MenuItem
              sx={{ color: 'error.main' }}
              onClick={() => {
                setDeleteOpen(true);
                setOpen(null);
              }}
            >
              <Iconify icon={'mdi:delete-outline'} sx={{ mr: 1.5, fontSize: '1.4rem' }} />
              Delete
            </MenuItem>
          )}
        </Popover>
      )}
      {onDeleteClick && (
        <DeleteConfirmModal
          actionState={deleteState}
          open={deleteOpen}
          handleClose={() => {
            setDeleteOpen(false);
            if (deleteState) deleteState?.reset();
          }}
          onClick={() => {
            onDeleteClick(openRow);
          }}
        />
      )}
    </>
  );
};

export default Table;
