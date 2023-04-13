import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { Box, List, ListItemText, Collapse } from '@mui/material';
import { StyledNavItem, StyledNavItemIcon, StyledNavSubItem } from './styles';
import Iconify from '../../../../components/iconify';
// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array,
  child: PropTypes.bool,
};

export default function NavSection({ data = [], child = false, ...other }) {
  return (
    <Box {...other}>
      <List disablePadding sx={child ? { pl: 2 } : { p: 1 }}>
        {data.map((item) => {
          if (item?.child) {
            return <NavCollapseItem key={item.title} item={item} subChild={child} />;
          }
          return <NavItem key={item.title} item={item} child={child} />;
        })}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

NavCollapseItem.propTypes = {
  item: PropTypes.object,
  subChild: PropTypes.bool,
};

function NavCollapseItem({ item, subChild }) {
  const { pathname } = useLocation();

  const { title, path, icon, child } = item;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(() => (pathname?.toUpperCase().includes(path.toUpperCase()) ? path.toUpperCase() : ''));
  }, [path, pathname]);

  if (subChild) {
    return (
      <>
        <StyledNavSubItem
          onClick={() => setOpen(() => (open === path.toUpperCase() ? '' : path.toUpperCase()))}
          sx={{
            mb: 0.6,

            ...(open === path.toUpperCase()
              ? {
                  color: 'primary.dark',
                  bgcolor: 'action.selected',
                  fontWeight: '600',
                }
              : {}),
            '&.active': {
              color: 'primary.dark',
              bgcolor: 'action.selected',
              fontWeight: 'fontWeightBold',
            },
          }}
        >
          <StyledNavItemIcon sx={{ minWidth: '35px' }}>{icon && icon}</StyledNavItemIcon>

          <ListItemText disableTypography primary={title} />

          {open !== path.toUpperCase() ? (
            <Iconify icon="mdi:chevron-right" sx={{ mr: 1 }} />
          ) : (
            <Iconify icon="mdi:chevron-down" sx={{ mr: 1 }} />
          )}
        </StyledNavSubItem>
        <Collapse in={open === path.toUpperCase()} timeout="auto" unmountOnExit>
          <NavSection data={child} child />
        </Collapse>
      </>
    );
  }
  return (
    <>
      <StyledNavItem
        onClick={() => setOpen(() => (open === path.toUpperCase() ? '' : path.toUpperCase()))}
        sx={{
          mb: 0.6,
          ...(open === path.toUpperCase()
            ? {
                color: 'primary.dark',
                bgcolor: 'action.selected',
                fontWeight: '600',
              }
            : {}),
          '&.active': {
            color: 'text.primary',
            bgcolor: 'action.selected',
            fontWeight: 'fontWeightBold',
          },
        }}
      >
        <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

        <ListItemText disableTypography primary={title} />
        {open !== path.toUpperCase() ? (
          <Iconify icon="mdi:chevron-right" sx={{ mr: 1 }} />
        ) : (
          <Iconify icon="mdi:chevron-down" sx={{ mr: 1 }} />
        )}
      </StyledNavItem>
      <Collapse in={open === path.toUpperCase()} timeout="auto" unmountOnExit>
        <NavSection data={child} child />
      </Collapse>
    </>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
  child: PropTypes.bool,
};

function NavItem({ item, child }) {
  const { title, path, icon, info } = item;
  if (child) {
    return (
      <StyledNavSubItem
        component={RouterLink}
        to={path}
        sx={{
          mb: 0.6,
          '&.active': {
            fontWeight: '600',
            color: 'primary.dark',
          },
        }}
      >
        <StyledNavItemIcon sx={{ minWidth: '35px' }}>
          <Iconify icon="mdi:circle" sx={{ width: '7px' }} />
        </StyledNavItemIcon>

        <ListItemText disableTypography primary={title} />

        {info && info}
      </StyledNavSubItem>
    );
  }

  return (
    <StyledNavItem
      component={RouterLink}
      to={path}
      sx={{
        mb: 0.6,
        '&.active': {
          color: 'text.primary',
          bgcolor: 'action.selected',
          fontWeight: 'fontWeightBold',
        },
      }}
    >
      <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

      <ListItemText disableTypography primary={title} />

      {info && info}
    </StyledNavItem>
  );
}
