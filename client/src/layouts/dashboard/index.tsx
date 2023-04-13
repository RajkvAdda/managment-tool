import { useState, useMemo } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { styled, Stack, Typography, Container, Box, Breadcrumbs, Divider, Avatar, Link } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import Header from './header';
import Nav from './nav';
import Iconify from '../../components/iconify';
import { useGetCompanyQuery } from '../../store/Master/companyApi';

// ----------------------------------------------------------------------
export const HEADER_MOBILE = 50;
export const HEADER_DESKTOP = 70;
export const NAV_WIDTH = 260;

const StyledRoot = styled('div')({
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  marginTop: HEADER_MOBILE,
  paddingTop: theme.spacing(5),
  paddingBottom: theme.spacing(5),
  [theme.breakpoints.up('lg')]: {
    marginTop: HEADER_DESKTOP,
    marginLeft: NAV_WIDTH,
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { data: company } = useGetCompanyQuery();

  // title
  const pageName = useMemo(() => {
    let name = pathname.split('/').slice(pathname.split('/').length - 1);
    return name[0].split('_').join(' ');
  }, [pathname]);

  // breadcrumbs
  const breadcumbs = useMemo(() => {
    return pathname.split('/').slice(1);
  }, [pathname]);

  return (
    <StyledRoot>
      <Helmet>
        <title> {`${pageName.toUpperCase()} | Managment Tool`} </title>
      </Helmet>
      <Header onOpenNav={() => setOpen(true)} />
      <Nav openNav={open} onCloseNav={() => setOpen(false)}>
        <Stack spacing={2} className={company?.isLoading ? 'skeleton' : ''}>
          <Avatar
            sx={{ width: '60px', height: '60px', borderRadius: '6px' }}
            src={company?.data?.avatar}
            alt="photoURL"
          />
          <Box>
            <Typography variant="subtitle1" sx={{ color: 'primary.darker' }}>
              {company?.data?.name ?? ''}
            </Typography>
            <Divider sx={{ m: 0 }} />
            <Link onClick={() => window.open(company?.data?.website, '_blank')} variant="subtitle2" underline="hover">
              {company?.data?.website ?? ''}
            </Link>
          </Box>
        </Stack>
      </Nav>
      <Main>
        <Container>
          <Stack sx={{ mb: 4 }}>
            <Box>
              <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>
                {pageName ?? ''}
              </Typography>
              <Breadcrumbs maxItems={4} separator="-" aria-label="breadcrumb">
                {breadcumbs.map((list, index) => {
                  return (
                    <Typography
                      component={NavLink}
                      key={index}
                      variant="body2"
                      color="inherit"
                      sx={{
                        textTransform: 'capitalize',
                        textDecoration: 'none',
                        pointerEvents: breadcumbs.length == index + 1 ? 'none' : 'auto',
                      }}
                      to={`/${pathname
                        .split('/')
                        ?.slice(1, index + 2)
                        ?.join('/')}`}
                    >
                      {list?.replaceAll('_', ' ')}
                    </Typography>
                  );
                })}
              </Breadcrumbs>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
              <Stack id="tab-action" sx={{ height: '100%', alignItems: 'center' }} />
            </Box>
          </Stack>
          <Outlet />
        </Container>
      </Main>
    </StyledRoot>
  );
}
