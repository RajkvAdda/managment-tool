import {
  Box,
  BoxProps,
  InputAdornment,
  MenuItem,
  Popover,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  alpha,
  styled,
} from '@mui/material';
import { FC, useMemo, useState } from 'react';
import Iconify from '../iconify';
import InputField from '../InputField';

const Comparisons = [
  { name: 'regex', label: 'mdi:regex' },
  { name: 'eq', label: 'mdi:equal' },
  { name: 'ne', label: 'mdi:not-equal' },
  { name: 'gt', label: 'mdi:greater-than' },
  { name: 'gte', label: 'mdi:greater-than-or-equal' },
  { name: 'lt', label: 'mdi:less-than' },
  { name: 'lte', label: 'mdi:less-than-or-equal' },
  { name: 'in', label: 'IN' },
  { name: 'nin', label: 'NIN' },
];

const Logicals = [
  { name: 'and', label: 'AND' },
  { name: 'not', label: 'NOT' },
  { name: 'or', label: 'OR' },
  { name: 'nor', label: 'NOR' },
];

// ================= FILTER INPUT ================= //
const InputBox = styled(Box)<BoxProps>(({ theme, select }) => ({
  position: 'relative',
  '& .MuiOutlinedInput-root , .MuiSelect-select': {
    padding: 0,
    overflow: 'hidden',
    '& input': {
      height: '1.1em',
    },
    '& .MuiInputAdornment-root': {
      padding: '12px 10px',
      height: 'auto',
      cursor: 'pointer',

      background: alpha(theme.palette.primary.light, 0.2),
      '& p': {
        fontWeight: '500',
      },
    },
  },
}));
export const FilterInput: FC<any> = ({ value, onChange, name, type, menus, useQuery, queryParams, ...rest }) => {
  const [openCondition, setOpenCondition] = useState(null);
  const [openBetween, setOpenBetween] = useState(null);
  // comparison
  const [comparison, setComparison] = useState(menus ? 'in' : type === 'number' ? 'eq' : 'regex');
  const compLabel = useMemo(() => {
    const find = Comparisons?.find((list) => list?.name == comparison);
    if (find?.label?.includes('mdi:')) {
      return <Iconify sx={{ color: 'primary.main' }} icon={find?.label} />;
    } else {
      return (
        <Typography sx={{ color: 'primary.main' }} variant="caption">
          {find?.label}
        </Typography>
      );
    }
  }, [comparison]);

  // Logicals
  const [logical, setLogical] = useState('and');
  const logiLabel = useMemo(() => {
    const find = Logicals?.find((list) => list?.name == logical);
    return (
      <Typography sx={{ color: 'primary.main' }} variant="caption">
        {find?.label}
      </Typography>
    );
  }, [logical]);

  // ============ handle query ================ //
  const queryData = useQuery ? (queryParams ? useQuery(queryParams) : useQuery()) : undefined;
  console.log('queryData', queryData);
  return (
    <>
      <InputBox>
        <InputField
          {...rest}
          type={type}
          loading={queryData?.isLoading}
          {...(menus ? { select: true } : {})}
          name={name}
          value={value?.[logical]?.[name]?.[comparison]}
          onChange={(e) => {
            const { name, value } = e.target;
            if (onChange) onChange(name, value, comparison, logical);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment
                position="start"
                sx={{ width: 45 }}
                onClick={(event) => setOpenCondition(event.currentTarget)}
              >
                {compLabel}
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment
                position="start"
                sx={{ m: 0, width: 60 }}
                onClick={(event) => setOpenBetween(event.currentTarget)}
              >
                {logiLabel}
              </InputAdornment>
            ),
          }}
        >
          {menus
            ? menus?.map((menu: any) => (
                <MenuItem key={menu?.value} value={menu?.value}>
                  {menu?.label ?? ''}
                </MenuItem>
              ))
            : null}
          {queryData?.data?.data &&
            queryData?.data?.data?.map((list) => (
              <MenuItem key={list?._id} value={list?._id}>
                {list?.name ?? ''}
              </MenuItem>
            ))}
        </InputField>
      </InputBox>

      {/* ============= CONDITION ============= */}
      <Popover
        open={Boolean(openCondition)}
        anchorEl={openCondition}
        onClose={() => {
          setOpenCondition(null);
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <ToggleButtonGroup
          orientation="vertical"
          value={comparison}
          aria-label="comparison"
          onChange={(e, newVal) => {
            if (onChange) onChange(name, value?.[logical]?.[name]?.[comparison], newVal, logical);
            setComparison(newVal);
            setOpenCondition(null);
          }}
          exclusive
        >
          {Comparisons?.filter((list) =>
            menus
              ? ['in', 'nin'].includes(list?.name)
              : type === 'text'
              ? ['regex', 'eq', 'ne'].includes(list?.name)
              : type === 'number'
              ? ['eq', 'ne', 'gt', 'gte', 'lt', 'lte'].includes(list?.name)
              : list
          )?.map(({ name, label }) => (
            <ToggleButton key={name} value={name} aria-label={name}>
              {label?.includes('mdi:') ? (
                <Iconify sx={{ color: 'primary.main' }} icon={label} />
              ) : (
                <Typography sx={{ color: 'primary.main' }} variant="caption">
                  {label}
                </Typography>
              )}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Popover>

      {/* =============BETWEEN CONDITION ============= */}
      <Popover
        open={Boolean(openBetween)}
        anchorEl={openBetween}
        onClose={() => {
          setOpenBetween(null);
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <ToggleButtonGroup
          orientation="vertical"
          exclusive
          value={logical}
          aria-label="logical"
          onChange={(e, newVal) => {
            if (onChange) onChange(name, '', comparison, logical);
            if (onChange) onChange(name, value?.[logical]?.[name]?.[comparison], comparison, newVal);

            setLogical(newVal);
            setOpenBetween(null);
          }}
        >
          {Logicals?.map(({ name, label }) => (
            <ToggleButton key={name} value={name} aria-label={name}>
              <Typography sx={{ color: 'primary.main' }} variant="caption">
                {label}
              </Typography>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Popover>
    </>
  );
};
