import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Typography, OutlinedInput, InputAdornment, Stack } from '@mui/material';
// component
import Iconify from '../iconify';
import Label from '../label/Label';
import { IconButton } from '../IconButtons';

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------

HeaderToolBar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  children: PropTypes.node,
  onDeleteFilter: PropTypes.any,
  masterFilter: PropTypes.any,
};

export default function HeaderToolBar({
  numSelected,
  filterName,
  onFilterName,
  children,
  masterFilter,
  onDeleteFilter,
}) {
  return (
    <>
      <StyledRoot
        sx={{
          ...(numSelected > 0 && {
            color: 'primary.main',
            bgcolor: 'primary.lighter',
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography component="div" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : onFilterName ? (
          <StyledSearch
            value={filterName}
            onChange={onFilterName}
            size="small"
            placeholder="Start Typing Name..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            }
          />
        ) : (
          <div></div>
        )}
        {children}
      </StyledRoot>
      {Object.entries(masterFilter ?? {}).length > 0 && (
        <Stack spacing={1} sx={{ px: 3, pb: 2 }}>
          {Object.entries(masterFilter)?.map(([key, lists]) =>
            lists?.map((list) =>
              Object.entries(list)?.map(([name, value]) => {
                const [con, val] = Object.entries(value)?.[0] ?? [];
                return (
                  <Label
                    key={name}
                    color={key === 'and' ? 'primary' : 'secondary'}
                    endIcon="mdi:window-close"
                    iconProps={{
                      sx: { cursor: 'pointer' },
                      onClick: () => {
                        if (onDeleteFilter) onDeleteFilter(name, '', con, key);
                      },
                    }}
                  >
                    {`${name}[${con}][${key}] : ${val}`}
                  </Label>
                );
              })
            )
          )}
        </Stack>
      )}
    </>
  );
}
