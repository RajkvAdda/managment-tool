import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Drawer } from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Scrollbar from '../../../components/scrollbar';
import NavSection from './nav-section';
//
import navConfig from './config';
import { NAV_WIDTH } from '..';

// ===============================================

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5, 1),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.primary.lighter,
  color: theme.palette.primary.darker,
}));

const RenderContent = ({ children }) => {
  return (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      {/* <Box sx={{ p: 2, display: 'inline-flex' }}>
        <Logo />
      </Box> */}

      <Box sx={{ my: 2, mx: 1 }}>
        <StyledAccount>{children}</StyledAccount>
      </Box>

      <NavSection data={navConfig} />

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2, pb: 2, mt: 10 }}></Box>
    </Scrollbar>
  );
};
// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav, children }) {
  const { pathname } = useLocation();
  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          <RenderContent>{children}</RenderContent>
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH, borderRadius: '0 10px 10px 0' },
          }}
        >
          <RenderContent>{children}</RenderContent>
        </Drawer>
      )}
    </Box>
  );
}
