import PropTypes from 'prop-types';
import { FC, forwardRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { StyledLabel } from './styles';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

const Label: FC<any> = forwardRef(
  ({ children, color = 'default', variant = 'soft', startIcon, iconProps, endIcon, sx, ...other }, ref) => {
    const theme = useTheme();

    const iconStyle = {
      width: 16,
      height: 16,
      '& svg, img': { width: 1, height: 1, objectFit: 'cover' },
      '&:hover': {
        border: '1px solid',
      },
    };

    return (
      <StyledLabel
        ref={ref}
        component="span"
        ownerState={{ color, variant }}
        sx={{
          ...(startIcon && { pl: 1 }),
          ...(endIcon && { pr: 1 }),
          ...sx,
        }}
        theme={theme}
        {...other}
      >
        {startIcon && (
          <Iconify sx={{ mr: 1, ...iconStyle, ...(iconProps.sx ?? {}) }} icon={startIcon} {...(iconProps ?? {})} />
        )}

        {children}

        {endIcon && (
          <Iconify icon={endIcon} {...(iconProps ?? {})} sx={{ ml: 1, ...iconStyle, ...(iconProps.sx ?? {}) }} />
        )}
      </StyledLabel>
    );
  }
);

Label.propTypes = {
  sx: PropTypes.object,
  endIcon: PropTypes.node,
  children: PropTypes.node,
  startIcon: PropTypes.node,
  variant: PropTypes.oneOf(['filled', 'outlined', 'ghost', 'soft']),
  color: PropTypes.oneOf(['default', 'primary', 'secondary', 'info', 'success', 'warning', 'error']),
};

export default Label;
