// @mui
import { styled } from '@mui/material/styles';
import { ListItemIcon, ListItemButton } from '@mui/material';

// ----------------------------------------------------------------------

export const StyledNavItem = styled((props) => <ListItemButton disableGutters {...props} />)(({ theme }) => ({
  ...theme.typography.subtitle2,
  height: 45,
  position: 'relative',
  textTransform: 'capitalize',
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
  mb: 1,
}));

export const StyledNavSubItem = styled((props) => <ListItemButton disableGutters {...props} />)(({ theme }) => ({
  ...theme.typography.caption,
  height: 35,
  position: 'relative',
  textTransform: 'capitalize',
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
  mb: 1,
}));

export const StyledNavItemIcon = styled(ListItemIcon)({
  width: 22,
  height: 22,
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 50,
});
