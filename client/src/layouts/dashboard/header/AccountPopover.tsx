import React, { useState, useEffect } from 'react';
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
import { useLogoutMutation } from '../../../store/auth/authApi';
import { setLoginData } from '../../../store/auth/authSlice';
import { useAppDispatch } from '../../../store/hooks';
import { useGetLoginUserQuery } from '../../../store/Master/userApi';
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Profile',
    icon: 'eva:person-fill',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
  },
  {
    label: 'Change Password',
    icon: 'eva:settings-2-fill',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const [logout, logoutState] = useLogoutMutation();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const dispatch = useAppDispatch();
  useEffect(() => {
    const { isSuccess } = logoutState;
    if (isSuccess) {
      dispatch(
        setLoginData({
          token: null,
          isLoggedIn: false,
          refreshTokenTime: null,
        })
      );
    }
  }, [logoutState]);
  // ========== hadle get login user =========== //
  const { data: loginUser } = useGetLoginUserQuery();
  console.log('loginUser', loginUser);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        size="large"
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={loginUser?.data?.avatar} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,

            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {loginUser?.data?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {loginUser?.data?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="column" spacing={0} sx={{ px: 1, py: 0.5 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} sx={{ width: '100%' }} onClick={handleClose}>
              <Iconify icon={option?.icon} sx={{ mr: 2 }} />
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            logout();
            handleClose();
          }}
          sx={{ m: 1 }}
        >
          <Iconify icon={'mdi:logout-variant'} sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
