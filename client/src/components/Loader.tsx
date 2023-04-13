import { FC } from 'react';
import Box from '@mui/material/Box';
import CircularProgress, { circularProgressClasses, CircularProgressProps } from '@mui/material/CircularProgress';

// Inspired by the former Facebook spinners.
const Loader: FC<CircularProgressProps> = ({ size, ...props }) => {
  return (
    <Box sx={{ position: 'relative', display: 'flex', height: size, width: size }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) => theme.palette.grey[theme.palette.mode === 'light' ? 100 : 800],
        }}
        thickness={3}
        {...props}
        size={size}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          animationDuration: '550ms',
          position: 'absolute',
          left: 0,
          top: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round',
          },
        }}
        size={size}
        thickness={3}
        {...props}
      />
    </Box>
  );
};

Loader.displayName = 'Loader';
export default Loader;
