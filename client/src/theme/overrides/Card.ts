// ----------------------------------------------------------------------

export default function Card(theme: {
  customShadows: { card: any };
  shape: { borderRadius: any };
  spacing: (arg0: number, arg1: number | undefined, arg2: number | undefined) => any;
  palette: { grey: any[]; background: any };
}) {
  return {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: theme.customShadows.card,
          borderRadius: Number(theme.shape.borderRadius),
          position: 'relative',
          zIndex: 0, // Fix Safari overflow: hidden with border radius
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: { variant: 'h6' },
        subheaderTypographyProps: { variant: 'body2' },
      },
      styleOverrides: {
        root: {
          padding: theme.spacing(2, 3, 2),
          backgroundColor: theme.palette.background.neutral,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3, 3, 3),
        },
      },
    },
  };
}
