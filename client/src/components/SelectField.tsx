import { Link, MenuItem, TextFieldProps } from '@mui/material';
import { FC, memo } from 'react';
import { State, City } from 'country-state-city';
import InputField, { InputPropsI } from './InputField';
import { NavLink } from 'react-router-dom';

const SelectField: FC<InputPropsI & TextFieldProps> = ({ children, value, label, placeholder, ...rest }) => {
  return (
    <InputField value={value ?? 0} {...rest} label={label} select>
      <MenuItem value={'0'}>{`Select  ${typeof label == 'string' ? label : placeholder ?? ''}`}</MenuItem>
      {children}
    </InputField>
  );
};

SelectField.displayName = 'SelectField';
export default memo(SelectField);

// select fields
export const SelectQueryField: FC<
  InputPropsI &
    TextFieldProps & {
      useQuery: any;
      queryParams?: any;
      link?:
        | {
            label: string;
            to: string;
          }
        | undefined;
    }
> = ({ useQuery, queryParams, link, onChange, ...rest }) => {
  const { data, isLoading } = queryParams ? useQuery(queryParams) : useQuery();
  return (
    <SelectField loading={isLoading} {...rest}>
      {data?.data?.map((list) => (
        <MenuItem
          key={list?._id}
          value={list?._id}
          onClick={() => {
            if (onChange) onChange(list?._id, list);
          }}
        >
          {list?.name ?? ''}
        </MenuItem>
      ))}
      {link && (
        <Link
          sx={{ width: '100%', display: 'block', mt: 1, textAlign: 'center' }}
          component={NavLink}
          to={link?.to ?? '/'}
          variant="subtitle2"
          underline="hover"
        >
          {link?.label}
        </Link>
      )}
    </SelectField>
  );
};

// =========== Select State =========== //
export const SelectStateField: FC<InputPropsI & TextFieldProps> = ({ onChange, ...rest }) => {
  return (
    <SelectField {...rest}>
      {State.getStatesOfCountry('IN')?.map((list) => (
        <MenuItem
          key={list?.isoCode}
          value={list?.isoCode}
          onClick={() => {
            if (onChange) onChange(list?.isoCode, list);
          }}
        >
          {list?.name ?? ''}
        </MenuItem>
      ))}
    </SelectField>
  );
};

// =========== Select CIty =========== //
export const SelectCityField: FC<InputPropsI & TextFieldProps & { stateCode: string }> = ({
  onChange,
  stateCode = 'KA',
  ...rest
}) => {
  return (
    <SelectField {...rest}>
      {City.getCitiesOfState('IN', stateCode)?.map((list) => (
        <MenuItem
          key={list?.name}
          value={list?.name}
          onClick={() => {
            if (onChange) onChange(list?.name, list);
          }}
        >
          {list?.name ?? ''}
        </MenuItem>
      ))}
    </SelectField>
  );
};
