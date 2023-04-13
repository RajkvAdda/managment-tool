export default function Divider(theme: any) {
  return {
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: theme.spacing(0.5, 0),
        },
      },
    },
  };
}
