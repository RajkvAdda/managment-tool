import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Popover, Paper, Box, Divider, Typography } from '@mui/material';
import { IconButton } from '../../../components/IconButtons';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setCustomization } from '../../../store/customization/customizationSlice';
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function ThemePopover() {
  const [open, setOpen] = useState(null);
  const dispatch = useAppDispatch();
  const customization = useAppSelector((state) => state.customization);
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton
        size="large"
        onClick={handleOpen}
        icon="mdi:palette"
        sx={{
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
          }),
        }}
      />

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            mt: 1.5,
            ml: 0.75,
          },
        }}
      >
        <Typography sx={{ p: 1 }} variant="subtitle1">
          Preset
        </Typography>
        <Divider sx={{ borderStyle: 'dashed', mb: 2 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: '30% 30% 30%', gap: '0.5rem' }}>
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
            <Paper
              onClick={() => {
                localStorage.setItem('theme', JSON.stringify({ primary, secondary }));
                dispatch(setCustomization({ primary, secondary }));
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
          ))}
        </Box>
      </Popover>
    </>
  );
}
