// ----------------------------------------------------------------------

export default function Table(theme: { palette: { text: { secondary: any }; background: { neutral: any } } }) {
  return {
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: theme.palette.text.secondary,
          backgroundColor: theme.palette.background.neutral,
        },
        root: {
          whiteSpace: 'nowrap',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&.MuiTableRow-hover:hover': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          '& caption': {
            position: 'sticky',
            left: 0,
          },
        },
      },
    },
  };
}
