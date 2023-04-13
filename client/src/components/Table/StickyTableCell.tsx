import { TableCell, TableCellProps } from '@mui/material';
import { FC } from 'react';

export const NameTableCell: FC<TableCellProps & { children: any; sx?: any; head?: boolean }> = ({
  children,
  sx,
  head,
  ...rest
}) => {
  return (
    <TableCell
      padding="checkbox"
      sx={{
        position: 'sticky',
        left: '0',
        width: '350px',
        '& *': {
          fontWeight: '500',
          border: 'none',
        },

        ...(head
          ? { bgcolor: (theme) => theme.palette.background.neutral, zIndex: 12 }
          : { bgcolor: 'background.paper', zIndex: 1 }),
        ...(sx ?? {}),
      }}
      {...rest}
    >
      {children ?? ''}
    </TableCell>
  );
};
export const ActionTableCell: FC<TableCellProps & { children: any; sx?: any; head?: boolean }> = ({
  children,
  sx,
  head,
  ...rest
}) => {
  return (
    <TableCell
      padding="checkbox"
      sx={{
        position: 'sticky',
        right: '0',
        width: '60px',
        '& *': {
          fontWeight: '600',
          border: 'none',
        },

        ...(head
          ? { bgcolor: (theme) => theme.palette.background.neutral, zIndex: 12 }
          : { bgcolor: 'background.paper', zIndex: 1 }),
        ...(sx ?? {}),
      }}
      {...rest}
    >
      {children ?? ''}
    </TableCell>
  );
};
