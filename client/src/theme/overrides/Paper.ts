// ----------------------------------------------------------------------

export default function Paper(theme: { shape: { borderRadius: any } }) {
  return {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          overflow: 'hidden',
          borderRadius: Number(theme.shape.borderRadius),
        },
      },
    },
  };
}
