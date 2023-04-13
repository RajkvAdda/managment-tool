import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar } from '@mui/material';
import { bgBlur } from '../../../utils/cssStyles';
import { IconButton } from '../../../components/IconButtons';
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import ThemePopover from './ThemePopover';
import NotificationsPopover from './NotificationsPopover';
import { HEADER_DESKTOP, HEADER_MOBILE, NAV_WIDTH } from '..';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setCustomization } from '../../../store/customization/customizationSlice';

// ----------------------------------------------------------------------

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  boxShadow: 'none',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${NAV_WIDTH + 1}px)`,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function Header({ onOpenNav }) {
  const customization = useAppSelector((state) => state.customization);
  const dispatch = useAppDispatch();
  const mode = useMemo(() => {
    return customization.mode === 'light' ? 'dark' : 'light';
  }, [customization?.mode]);
  return (
    <StyledRoot>
      <StyledToolbar>
        <IconButton
          title=""
          onClick={onOpenNav}
          icon="eva:menu-2-fill"
          sx={{
            mr: 1,
            color: 'text.primary',
            display: { lg: 'none' },
          }}
        />

        <Searchbar />
        <Box sx={{ flexGrow: 1 }} />

        <Stack alignItems="center" spacing={0}>
          <IconButton
            title=""
            size="large"
            color={mode === 'light' ? 'warning' : 'primary'}
            icon={mode === 'dark' ? 'mdi:weather-night' : 'mdi:white-balance-sunny'}
            onClick={() => {
              localStorage.setItem('mode', mode);
              dispatch(setCustomization({ mode }));
            }}
          />
          <ThemePopover />
          <NotificationsPopover />
          <AccountPopover />
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}
