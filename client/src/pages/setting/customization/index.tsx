import { Grid, Paper, Divider } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setCustomization } from '../../../store/customization/customizationSlice';
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function Customization() {
  const dispatch = useAppDispatch();
  const customization = useAppSelector((state) => state.customization);
  console.log('customization', customization);
  return (
    <>
      <Divider textAlign="left" sx={{ mb: 2 }}>
        Mode
      </Divider>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {['light', 'dark'].map((mode, index) => (
          <Grid key={index} item xs={12} sm={1}>
            <Paper
              onClick={() => {
                localStorage.setItem('mode', mode);
                dispatch(setCustomization({ mode }));
              }}
              sx={{
                width: '50px',
                height: '50px',
                position: 'relative',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: mode === 'light' ? '#fff' : 'rgb(34, 43, 54)',
              }}
            >
              {customization.mode === mode ? <Iconify icon="mdi:check-bold" /> : null}
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Divider textAlign="left" sx={{ mb: 2 }}>
        Preset Theme
      </Divider>
      <Grid container spacing={3}>
        {[
          { primary: '#2065D1', secondary: '#3366FF' },
          { primary: '#9c27b0', secondary: '#d500f9' },
          { primary: '#673ab7', secondary: '#651fff' },
          { primary: '#009688', secondary: '#1de9b6' },
          { primary: '#3f51b5', secondary: '#3d5afe' },
          { primary: '#4caf50', secondary: '#00e676' },
          { primary: '#ff9800', secondary: '#ff9100' },
          { primary: '#03a9f4', secondary: '#00b0ff' },
        ].map(({ primary, secondary }, index) => (
          <Grid key={index} item xs={12} sm={1}>
            <Paper
              onClick={() => {
                localStorage.setItem('theme', JSON.stringify({ primary, secondary }));
                dispatch(setCustomization({ primary, secondary }));

                console.log('theme color', primary, secondary);
              }}
              sx={{
                width: '50px',
                height: '50px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  backgroundColor: primary,
                  clipPath: 'polygon(0 0, 0% 100%, 100% 0)',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  backgroundColor: secondary,
                  clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)',
                },
              }}
            >
              {customization.primary === primary && customization.secondary === secondary ? (
                <Iconify icon="mdi:check-bold" sx={{ zIndex: 9, color: '#fff' }} />
              ) : null}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
