import { useLayoutEffect, ReactNode } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import palette from './palette';
import shadows from './shadows';
import typography from './typography';
import GlobalStyles from './globalStyles';
import customShadows from './customShadows';
import componentsOverride from './overrides';
import { setCustomization } from '../store/customization/customizationSlice';

// ----------------------------------------------------------------------
const getThemeOption = ({
  mode,
  primary,
  secondary,
  borderRadius,
}: {
  mode: 'light' | 'dark';
  primary: string;
  secondary: string;
  borderRadius: number;
}) => {
  const paletteTheme = palette({ mode, primary, secondary });
  return {
    palette: paletteTheme,
    shape: { borderRadius },
    typography,
    shadows: shadows(paletteTheme),
    customShadows: customShadows(paletteTheme),
  };
};

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const customization = useAppSelector((state) => state.customization);
  const themeoption: any = getThemeOption(customization);
  const theme = createTheme(themeoption);
  theme.components = componentsOverride(theme);
  const dispatch = useAppDispatch();
  useLayoutEffect(() => {
    const theme = localStorage.getItem('theme') ?? null;
    const mode = localStorage.getItem('mode') ?? 'light';
    let color = { primary: '#2065D1', secondary: '#3366FF' };
    if (theme) {
      color = JSON.parse(theme);
    }
    dispatch(setCustomization({ mode, ...color }));
  }, []);

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}
