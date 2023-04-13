import { FC, useMemo, useState } from 'react';
import { DateValidationError, DatePickerProps } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const DateField: FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  required,
  disabled,
  format,
  minDate,
  maxDate,
  ...rest
}) => {
  const [error, setError] = useState<DateValidationError | null>(null);
  const errorMessage = useMemo(() => {
    switch (error) {
      case 'maxDate': {
        return `Maximum date (${dayjs(maxDate).format(format)}) allow`;
      }
      case 'minDate': {
        return `Maximum date (${dayjs(minDate).format(format)}) allow`;
      }
      case 'invalidDate': {
        return 'Your date is not valid';
      }
      default: {
        return null;
      }
    }
  }, [error]);
  return (
    <Box
      sx={{
        '& .MuiStack-root': {
          p: 0,
          margin: (theme) => theme.spacing(0.7, 0, 3, 0),
        },

        '& .MuiTextField-root': {
          width: '100%',
        },
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
        <DemoContainer components={['DatePicker']}>
          <DatePicker
            {...rest}
            onError={(newError) => setError(newError)}
            slotProps={{
              textField: {
                helperText: errorMessage,
              },
            }}
            value={dayjs(value)}
            disabled={disabled}
            format={format}
            minDate={minDate ? dayjs(minDate) : null}
            maxDate={maxDate ? dayjs(maxDate) : null}
            onChange={(newDate) => {
              if (onChange) onChange(newDate);
            }}
          />
        </DemoContainer>
      </LocalizationProvider>
    </Box>
  );
};
DateField.defaultProps = {
  format: 'DD-MM-YYYY',
};

export default DateField;
