import { alpha, IconButton as BTN, IconButtonProps, styled, Tooltip } from '@mui/material';
import { FC, useState, useEffect } from 'react';
import { DeleteConfirmModal } from './Modal';
import Loader from './Loader';
import useAudio, { soundLists } from '../utils/useAudio';
import Iconify from './iconify';

interface IconButtonI extends IconButtonProps {
  variant?: 'text' | 'contained' | 'outlined' | undefined;
  loading?: boolean;
  success?: boolean;
  failed?: boolean;
}

interface PropsI {
  title?: string;
  icon?: string;
  placement?:
    | 'bottom'
    | 'left'
    | 'right'
    | 'top'
    | 'bottom-end'
    | 'bottom-start'
    | 'left-end'
    | 'left-start'
    | 'right-end'
    | 'right-start'
    | 'top-end'
    | 'top-start'
    | undefined;
}

const BTNStyled = styled(BTN)<IconButtonI>(({ variant, theme }) => ({
  ...(variant == 'contained' && {
    borderRadius: theme.shape.borderRadius,
    '&.MuiIconButton-colorPrimary': {
      ...(theme.palette.mode == 'light'
        ? { backgroundColor: theme.palette.primary.light }
        : { backgroundColor: theme.palette.primary.main, color: '#fff' }),
    },

    '&.MuiIconButton-colorWarning': {
      backgroundColor: alpha(theme.palette.warning.light, 0.2),
    },
    '&.MuiIconButton-colorError': {
      backgroundColor: alpha(theme.palette.error.light, 0.2),
    },
    '&.MuiIconButton-colorSecondary': {
      backgroundColor: theme.palette.secondary.light,
    },
    '&.MuiIconButton-colorSuccess': {
      backgroundColor: alpha(theme.palette.success.light, 0.2),
    },
  }),
  ...(variant == 'outlined' && {
    borderRadius: theme.shape.borderRadius,
    '&.MuiIconButton-colorPrimary': {
      border: '1px solid',
      borderColor: theme.palette.primary.main,
    },
    '&.MuiIconButton-colorSecondary': {
      border: '1px solid',
      borderColor: theme.palette.secondary.main,
    },
  }),
}));

export const IconButton: FC<IconButtonI & PropsI> = ({
  placement,
  title,
  icon,
  loading,
  success,
  failed,
  color,
  ...rest
}) => {
  useEffect(() => {
    if (success) {
      useAudio(soundLists.success);
    }
    if (failed) {
      useAudio(soundLists.error);
    }
  }, [success, failed]);

  return (
    <Tooltip title={title ?? ''} placement={placement} arrow>
      <BTNStyled
        loading={loading}
        success={success}
        failed={failed}
        color={success ? 'success' : failed ? 'error' : color}
        disabled={loading}
        {...rest}
      >
        {loading ? (
          <Loader color={color} size={20} />
        ) : (
          <Iconify icon={success ? 'mdi:check-bold' : failed ? 'mdi:close' : icon ?? 'I'} />
        )}
      </BTNStyled>
    </Tooltip>
  );
};

IconButton.displayName = 'IconButton';
IconButton.defaultProps = {
  placement: 'top',
  variant: 'text',
  color: 'primary',
};

export const AddIconButton: FC<IconButtonI> = ({ title, size, ...rest }) => (
  <IconButton title={title} icon="mdi:plus" size={size} {...rest} />
);

AddIconButton.displayName = 'AddIconButton';
AddIconButton.defaultProps = {
  title: 'Add',
};

export const EditIconButton: FC<IconButtonI> = ({ title, size, color, ...rest }) => (
  <IconButton size={size} color={color} icon="mdi:pencil" title={title} {...rest} />
);

EditIconButton.displayName = 'EditIconButton';
EditIconButton.defaultProps = {
  title: 'Edit',
  color: 'secondary',
};

export const BackIconButton: FC<IconButtonI> = ({ title, size, color, ...rest }) => (
  <IconButton size={size} color={color} icon="mdi:keyboard-backspace" title={title} {...rest} />
);

BackIconButton.displayName = 'BackIconButton';
BackIconButton.defaultProps = {
  title: 'Back',
  color: 'default',
};
interface DeleteIconButtonI {
  onConfirm: () => void;
  isDelete?: boolean | string | null;
  actionState: any;
  customMsg?: any;
}
export const DeleteIconButton: FC<IconButtonI & DeleteIconButtonI> = ({
  onConfirm,
  isDelete,
  actionState,
  size,
  title,
  customMsg,
  ...rest
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        title={title}
        size={size}
        color="error"
        icon="mdi:delete-outline"
        onClick={() => {
          if (isDelete == true) {
            setOpen(true);
          } else if (!isDelete) {
            if (onConfirm) onConfirm();
          } else {
            alert(isDelete);
          }
        }}
        {...rest}
      />

      {isDelete && (
        <DeleteConfirmModal
          actionState={actionState}
          open={open}
          handleClose={() => {
            setOpen(false);
            actionState?.reset();
          }}
          onClick={() => {
            onConfirm();
          }}
        >
          {customMsg}
        </DeleteConfirmModal>
      )}
    </>
  );
};

DeleteIconButton.displayName = 'DeleteIconButton';
DeleteIconButton.defaultProps = {
  isDelete: 'Did not find any record to Delete!',
  title: 'Delete',
  customMsg: null,
};

export const HistoryIconButton: FC<IconButtonI> = ({ title, size, ...rest }) => (
  <IconButton size={size} icon="mdi:timeline-outline" title={title} {...rest} />
);

HistoryIconButton.displayName = 'HistoryIconButton';
HistoryIconButton.defaultProps = {
  title: 'History',
};

export const FilterIconButton: FC<IconButtonI> = ({ title, size, ...rest }) => (
  <IconButton size={size} icon="ic:round-filter-list" title={title} {...rest} />
);

FilterIconButton.displayName = 'FilterIconButton';
FilterIconButton.defaultProps = {
  title: 'Filter',
};

export const CloseIconButton: FC<IconButtonI> = ({ title, size, ...rest }) => (
  <IconButton size={size} icon="mdi:window-close" color="error" title={title} {...rest} />
);

CloseIconButton.displayName = 'CloseIconButton';
CloseIconButton.defaultProps = {
  title: 'Close',
};
