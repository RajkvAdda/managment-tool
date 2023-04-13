import { FC, useEffect } from 'react';
import {
  Pagination as RPagination,
  PaginationProps,
  CardActions,
  Stack,
  Select,
  MenuItem,
  useMediaQuery,
  TablePagination,
} from '@mui/material';
import { Small } from './Typography';
export interface PaginationPropsI {
  pageSize: number;
  pageSizeLists?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  pageNumber: number;
  searchValue: string;
  totalRecords: number;
  onPageNumberChange: (pageNumber: number) => void;
}

const Pagination: FC<PaginationProps & PaginationPropsI> = ({
  pageSize,
  pageSizeLists,
  onPageSizeChange,
  pageNumber,
  searchValue,
  totalRecords,
  onPageNumberChange,
  ...rest
}) => {
  // resetting pagenumber when search value is changed
  useEffect(() => {
    if (searchValue) {
      alert('searched');
      onPageNumberChange(1);
    }
  }, [searchValue]);

  const downMd = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
  if (downMd) {
    return (
      <CardActions>
        <TablePagination
          component="div"
          count={totalRecords}
          page={pageNumber}
          onPageChange={(e, value) => {
            if (onPageNumberChange) onPageNumberChange(value);
          }}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => {
            if (onPageSizeChange) onPageSizeChange(e.target.value);
          }}
          {...rest}
        />
      </CardActions>
    );
  }
  return (
    <>
      <Stack justifyContent={'end'}>
        <div>
          <Stack spacing={1}>
            <Small>Rows per page</Small>
            <Select
              sx={{
                '& fieldset': {
                  border: 'none',
                },
              }}
              size="small"
              value={pageSize}
              onChange={(e) => {
                if (onPageSizeChange) onPageSizeChange(e.target.value);
              }}
            >
              {pageSizeLists?.map((list) => (
                <MenuItem key={list} value={list}>
                  {list}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </div>
        <div>
          <Stack spacing={1}>
            <Small>{`${pageSize * pageNumber - (pageSize - 1) ?? ''} to ${
              pageSize * pageNumber < totalRecords ? pageSize * pageNumber : totalRecords ?? ''
            } of ${totalRecords ?? ''}`}</Small>
            <RPagination
              count={Math.ceil(totalRecords / pageSize)}
              size="small"
              page={pageNumber}
              onChange={(e, value) => onPageNumberChange(value)}
              showFirstButton={Math.ceil(totalRecords / pageSize) >= 5}
              showLastButton={Math.ceil(totalRecords / pageSize) >= 5}
              {...rest}
            />
          </Stack>
        </div>
      </Stack>
    </>
  );
};
Pagination.displayName = 'Pagination';
Pagination.defaultProps = {
  pageSize: 10,
  pageSizeLists: [5, 10, 25, 50, 100],
  onPageSizeChange: undefined,
};
export default Pagination;
