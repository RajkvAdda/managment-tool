/* eslint-disable react/require-default-props */
import {
  TextField,
  TextFieldProps,
  styled,
  useMediaQuery,
  InputAdornment,
  Typography,
  Autocomplete,
  MenuItem,
} from '@mui/material';
import React, { FC, useState, memo, useLayoutEffect } from 'react';
import {
  Email,
  //  Password,
  Mobile,
  Aadhar,
  BankAccount,
  CIN,
  GSTIN,
  IFSCCode,
  PAN,
  PinCodeIndia,
  TAN,
  UAN,
  ESI,
} from '../utils/pattern';
import { IconButton } from './IconButtons';
import { PANEnum } from '../utils/Enum';
import Iconify from './iconify';
import { SelectCityField, SelectStateField } from './SelectField';
import { useGetLocationQuery } from '../store/common/commonApi';

export interface InputPropsI {
  min?: number | undefined;
  max?: number | undefined;
  exact?: number | undefined;
  error?: any;
  patternMsg?: string | undefined;
  pattern?: string | undefined;
  checkError?: boolean | undefined;
  bg?: boolean | undefined;
  noCap?: boolean;
  placeholderPrefix?: string | null | undefined;
  loading?: boolean;
  rightAlign?: boolean | undefined;
  readOnly?: boolean;
  style?: any;
  allowZero?: boolean;
}

const InputStyled = styled(TextField)<TextFieldProps & InputPropsI>(({ bg, theme, rightAlign }) => ({
  margin: bg ? theme.spacing(0.7, 0, 1.5, 0) : theme.spacing(0.7, 0, 3, 0),
  minWidth: '200px',
  '& .MuiOutlinedInput-root': {
    background: bg ? theme.palette.grey[200] : '',
    '&.Mui-error': {
      background: bg ? theme.palette.error.lighter : '',
    },
  },
  '& .MuiFormHelperText-root': {
    textAlign: rightAlign ? 'right' : 'left',
  },
}));

const InputField: FC<TextFieldProps & InputPropsI> = ({
  onBlur,
  required,
  id,
  min,
  max,
  value,
  exact,
  pattern,
  patternMsg,
  size,
  placeholder,
  bg,
  rightAlign,
  error,
  placeholderPrefix,
  name,
  label,
  checkError,
  loading,
  variant,
  disabled,
  readOnly,
  className,
  inputProps,
  noCap,
  style,
  allowZero,
  ...rest
}) => {
  const [inputError, setCheckError] = useState(false);
  let [isPrentModal, setIsParentModal] = useState<any>(null);
  const downMd = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
  useLayoutEffect(() => {
    setIsParentModal(document.querySelector('.MuiModal-root .MuiInputBase-root'));
  }, []);
  const handleError = () => {
    if (required && !allowZero && (!value || value == '-1' || value == '0'))
      return { error: true, helperText: 'Field Required' };
    if (!allowZero && value == '0' && !rest?.select) return { error: true, helperText: 'Field Required' };
    if (value) {
      if (min && String(value)?.length < min)
        return {
          error: true,
          helperText: patternMsg ?? `Minimum ${min} Character Required`,
        };

      if (max && String(value)?.length > max)
        return {
          error: true,
          helperText: patternMsg ?? `Maximum ${max} Character Allowed`,
        };

      if (exact && String(value)?.length != exact)
        return { error: true, helperText: `Exact ${exact} Character Required` };

      if (pattern) {
        let regExp = new RegExp(pattern);
        if (!regExp?.test(value ?? '')) return { error: true, helperText: patternMsg ?? `Invalid ${label}` };
      }
    }
    if (error) {
      return { error: true, helperText: error };
    }
  };
  return (
    <div style={style}>
      {label && (
        <Typography sx={{ position: 'relative', marginLeft: '2px' }} variant="caption">
          {label}
          {required && !disabled && (
            <span
              style={{
                position: 'absolute',
                top: '-1px',
                right: '-8px',
                fontSize: '8px',
                color: '#eb4747',
              }}
            >
              &#x272E;
            </span>
          )}
        </Typography>
      )}

      <InputStyled
        className={`${loading ? 'skeleton' : ''} ${className}`}
        id={id || name}
        {...(inputError || checkError || error ? !disabled && handleError() : {})}
        name={name}
        rightAlign={rightAlign}
        onInput={(e) =>
          noCap
            ? false
            : (e.target.value = `${e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)}`?.trimStart())
        }
        bg={Boolean(bg ?? isPrentModal ? true : false)}
        size={downMd ? 'small' : size ?? (isPrentModal && 'small')}
        fullWidth
        variant={variant}
        placeholder={placeholder ? `${placeholderPrefix ?? ''}${placeholder}` : null}
        onBlur={(e) => {
          if (onBlur) onBlur(e);
          setCheckError(true);
        }}
        required={required}
        value={value}
        disabled={disabled}
        autoComplete="off"
        inputProps={{ readOnly, ...inputProps }}
        {...rest}
      />
    </div>
  );
};

InputField.displayName = 'InputField';
InputField.defaultProps = {
  min: undefined,
  max: undefined,
  exact: undefined,
  error: undefined,
  pattern: undefined,
  patternMsg: undefined,
  checkError: undefined,
  placeholderPrefix: 'eg: ',
  bg: undefined,
  noCap: false,
  rightAlign: false,
  disabled: false,
  readOnly: false,
  style: undefined,
  allowZero: undefined,
  variant: 'outlined',
};
export default memo(InputField);

export const NumberField: FC<TextFieldProps & InputPropsI> = ({ value, allowZero, ...rest }) => (
  <InputField
    type="number"
    allowZero={allowZero}
    onKeyDown={(e) => {
      if (e.code === 'Minus') {
        e.preventDefault();
      }
    }}
    inputProps={{ inputMode: 'numeric', pattern: '^[1-9]+[0-9]*' }}
    {...rest}
    value={allowZero ? value : value == 0 ? '' : value}
  />
);

NumberField.displayName = 'NumberField';
NumberField.defaultProps = {
  allowZero: undefined,
};

export const AmountField: FC<TextFieldProps & InputPropsI> = ({
  onFocus,
  required,
  value,
  allowZero,
  onChange,
  ...rest
}) => {
  const [change, setChange] = useState<boolean>(false);

  return (
    <InputField
      pattern={`^([-])?[0-9]{1,12}([\\.][0-9]{1,2})?$`}
      patternMsg={`Invalid Amount`}
      rightAlign
      allowZero={allowZero}
      required={required}
      value={change || allowZero ? value : Number(value) != 0 ? value : required ? '' : ''}
      onKeyDown={(e) => {
        if (e.code === 'Minus') {
          e.preventDefault();
        }
      }}
      onChange={(e) => {
        if (onChange) onChange(e);
        setChange(true);
      }}
      onFocus={(e) => {
        e.target.select();
        if (onFocus) onFocus(e);
      }}
      {...rest}
    />
  );
};
AmountField.displayName = 'AmountField';

export const PercentField: FC<TextFieldProps & InputPropsI> = ({
  onFocus,
  required,
  value,
  allowZero,
  onChange,
  ...rest
}) => {
  const [change, setChange] = useState<boolean>(false);

  return (
    <AmountField
      pattern={`^[0-9]{1,2}([\\.][0-9]{1,2})?$`}
      placeholder="18%"
      patternMsg={`Max 99.99 allowed`}
      rightAlign
      allowZero={allowZero}
      required={required}
      value={change || allowZero ? value : Number(value) != 0 ? value : required ? '' : ''}
      onChange={(e) => {
        if (onChange) onChange(e);
        setChange(true);
      }}
      onFocus={(e) => {
        e.target.select();
        if (onFocus) onFocus(e);
      }}
      {...rest}
    />
  );
};
PercentField.displayName = 'PercentField';

export const TextArea: FC<TextFieldProps & InputPropsI> = ({ ...rest }) => <InputField multiline rows={3} {...rest} />;
TextArea.displayName = 'TextArea';

export const SearchField: FC<TextFieldProps & InputPropsI & { noIcon?: boolean }> = ({
  InputProps,
  noIcon,
  ...rest
}) => (
  <InputField
    placeholder="Start Typing... "
    placeholderPrefix={null}
    InputProps={{
      ...InputProps,
      startAdornment: noIcon ? null : (
        <InputAdornment position="start">
          <Iconify icon="mdi:magnify" />
        </InputAdornment>
      ),
    }}
    {...rest}
  />
);
SearchField.displayName = 'SearchField';
SearchField.defaultProps = {
  noIcon: undefined,
};

export const EmailField: FC<TextFieldProps & InputPropsI> = ({ ...rest }) => (
  <InputField placeholder="abc@email.com" type="email" noCap inputProps={{ inputMode: 'email' }} {...Email} {...rest} />
);
EmailField.displayName = 'EmailField';

export const MobileField: FC<TextFieldProps & InputPropsI> = ({ ...rest }) => (
  <NumberField placeholder="99XXXXXX99" {...Mobile} allowZero exact={10} {...rest} />
);
MobileField.displayName = 'MobileField';

export const PANField: FC<TextFieldProps & InputPropsI> = ({ value, name, onChange, ...rest }) => (
  <Autocomplete
    freeSolo
    selectOnFocus
    autoHighlight
    value={value ?? ''}
    onChange={(event: any, newValue: string | null) => {
      onChange({ target: { name: name, value: newValue ?? '' } });
    }}
    inputValue={value ?? ''}
    onInputChange={(event, newValue) => {
      onChange({ target: { name: name, value: newValue ?? '' } });
    }}
    renderInput={(params) => (
      <InputField
        onInput={(e) => (e.target.value = e.target?.value?.toUpperCase() ?? '')}
        placeholder="ABCTY1234D"
        placeholderPrefix={null}
        value={value ?? ''}
        {...params}
        {...rest}
        {...(Object?.entries(PANEnum)
          ?.map((li) => li[1])
          ?.includes(value ?? '')
          ? {}
          : { ...PAN })}
      />
    )}
    options={
      Object?.entries(PANEnum)?.map(([key, val]) => ({
        label: val,
        id: key,
      })) ?? []
    }
    renderOption={(props, option) => (
      <MenuItem {...props} sx={{ cursor: 'pointer' }}>
        {option?.label}
      </MenuItem>
    )}
  />
);
PANField.displayName = 'PANField';

export const TANField: FC<TextFieldProps & InputPropsI> = ({ ...rest }) => (
  <InputField
    onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
    placeholder={'RAJA99999B'}
    {...rest}
    {...TAN}
  />
);
TANField.displayName = 'TANField';

export const CINField: FC<TextFieldProps & InputPropsI> = ({ ...rest }) => (
  <InputField
    onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
    placeholder="L27100MH1907PLC000260"
    {...CIN}
    {...rest}
  />
);
CINField.displayName = 'CINField';

export const PFField: FC<TextFieldProps & InputPropsI> = ({ ...rest }) => (
  <InputField onInput={(e) => (e.target.value = e.target.value.toUpperCase())} placeholder="Enter PF no." {...rest} />
);
PFField.displayName = 'PFField';

export const UANField: FC<TextFieldProps & InputPropsI> = ({ ...rest }) => (
  <NumberField placeholder="444433332222" {...UAN} {...rest} />
);
UANField.displayName = 'UANField';

export const ESIField: FC<TextFieldProps & InputPropsI> = ({ ...rest }) => (
  <NumberField placeholder={`31001234560000001`} {...ESI} {...rest} />
);
ESIField.displayName = 'ESIField';

export const AadharField: FC<TextFieldProps & InputPropsI> = ({ ...rest }) => (
  <NumberField placeholder="444433332222" {...Aadhar} {...rest} />
);
AadharField.displayName = 'AadharField';

export const AddressField: FC<TextFieldProps & InputPropsI> = ({ value, onChange, ...rest }) => {
  // ========= handle Loaction
  const [checkLocation, setCheckLoacation] = useState(true);
  const location = useGetLocationQuery(value, { skip: checkLocation && value?.length > 5 ? false : true });
  console.log('location', location);
  return (
    <>
      <TextArea
        placeholder="#73 Rajaji Nagar, near Metro Station, Bangalore, karnataka - 560076  "
        {...rest}
        value={value}
        onFocus={() => setCheckLoacation(false)}
        onBlur={() => setCheckLoacation(true)}
        onChange={(e) => {
          if (onChange) onChange(e, location?.data?.data);
        }}
      />
      <SelectStateField
        loading={location?.isLoading || location?.isFetching}
        disabled
        name="state"
        label="State"
        value={location?.data?.data?.state ?? '-1'}
      />
      <SelectCityField
        loading={location?.isLoading || location?.isFetching}
        disabled
        name="city"
        label="City"
        stateCode={location?.data?.data?.state}
        value={location?.data?.data?.city ?? '-1'}
      />
      <NumberField
        disabled
        loading={location?.isLoading || location?.isFetching}
        name="zipcode"
        label="PIN Code"
        {...PinCodeIndia}
        value={location?.data?.data?.zipcode ?? ''}
      />
    </>
  );
};
AddressField.displayName = 'AddressField';

export const GSTINField: FC<TextFieldProps & InputPropsI> = ({ ...rest }) => (
  <InputField
    onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
    placeholder="29AADCB2230M1ZP"
    {...GSTIN}
    {...rest}
  />
);
GSTINField.displayName = 'GSTINField';

export const BackAccountField: FC<TextFieldProps & InputPropsI> = ({ ...rest }) => (
  <NumberField placeholder="123456789676" {...BankAccount} {...rest} />
);
BackAccountField.displayName = 'BackAccountField';

export const IFSCCodeField: FC<TextFieldProps & InputPropsI> = ({ ...rest }) => (
  <InputField
    onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
    placeholder="ABCD0010889"
    {...IFSCCode}
    {...rest}
  />
);
IFSCCodeField.displayName = 'IFSCCodeField';

export const PinCodeField: FC<TextFieldProps & InputPropsI> = ({ ...rest }) => (
  <NumberField placeholder="560076" {...PinCodeIndia} {...rest} />
);
PinCodeField.displayName = 'PinCodeField';

export const PasswordField: FC<TextFieldProps & InputPropsI> = ({ ...rest }) => {
  const [show, setShow] = useState(false);
  return (
    <InputField
      type={show ? 'text' : 'password'}
      placeholder="Password@1234"
      InputProps={{
        endAdornment: (
          <IconButton
            onClick={() => setShow(!show)}
            icon={!show ? 'mdi:eye' : 'mdi:eye-off'}
            onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault()}
          />
        ),
      }}
      {...rest}
    />
  );
};

PasswordField.displayName = 'PasswordField';
