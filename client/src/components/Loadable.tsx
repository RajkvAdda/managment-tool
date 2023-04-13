import { Suspense } from 'react';
import { Box, LinearProgress } from '@mui/material';
import { useAppSelector } from '../store/hooks';
// project imports

export const PageLoader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '75vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <LinearProgress sx={{ width: '320px' }} color="primary" />
    </Box>
  );
};

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

const Loadable = (Component) =>
  // eslint-disable-next-line func-names
  function (props) {
    // console.clear();
    return (
      <Suspense fallback={<PageLoader />}>
        <Component {...props} />
      </Suspense>
    );
  };

Loadable.displayName = 'Loadable';
export default Loadable;
