import { Button as BTN, ButtonProps, styled } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import Loader from './Loader';
import useAudio, { soundLists } from '../utils/useAudio';
import { ClearConfirmModal, DiscardConfirmModal } from './Modal';
import Iconify from './iconify';
interface ButtonI extends ButtonProps {
  loading?: boolean | undefined;
  success?: boolean | undefined;
  failed?: boolean | undefined;
}
const BTNStyled = styled(BTN)<ButtonI>(({ theme }) => ({
  textTransform: 'capitalize',
  letterSpacing: '0.54px',
  padding: '0.444rem 1rem',
  fontSize: '0.84rem',
  cursor: 'pointer',
  [theme.breakpoints.down(600)]: { minWidth: '80px' },
}));

const Button: FC<ButtonI> = ({ children, color, loading, success, failed, startIcon, size, variant, id, ...rest }) => {
  useEffect(() => {
    if (success) {
      useAudio(soundLists.success);
    }
    if (failed) {
      useAudio(soundLists.error);
    }
  }, [success, failed]);

  return (
    <BTNStyled
      variant={variant}
      size={size}
      data-automation={success ? 'success' : ''}
      id={`${id}`}
      color={success ? 'success' : failed ? 'error' : color}
      disabled={Boolean(loading)}
      disableElevation
      startIcon={
        loading ? (
          <Loader color={color} size={20} />
        ) : (
          <Iconify icon={success ? 'mdi:check' : failed ? 'mdi:close' : startIcon ?? ''} />
        )
      }
      {...rest}
    >
      <span className="btn-text">{children}</span>
    </BTNStyled>
  );
};

Button.displayName = 'Button';
Button.defaultProps = {
  loading: undefined,
  failed: undefined,
  success: undefined,
  size: 'small',
  variant: 'contained',
};

export default Button;

export const AddButton: FC<ButtonI> = ({ children, ...rest }) => (
  <Button startIcon={'mdi:plus'} {...rest}>
    {children}
  </Button>
);

AddButton.displayName = 'AddButton';
AddButton.defaultProps = {
  children: 'Add',
};

export const EditButton: FC<ButtonI> = ({ ...rest }) => (
  <Button startIcon={'mdi:pencil'} {...rest}>
    Edit
  </Button>
);

EditButton.displayName = 'EditButton';

export const DeleteButton: FC<ButtonI> = ({ ...rest }) => (
  <Button startIcon={'mdi:delete-outline'} color="error" {...rest}>
    Delete
  </Button>
);

DeleteButton.displayName = 'DeleteButton';

export const CancleButton: FC<ButtonI> = ({ children, ...rest }) => (
  <Button startIcon={'mdi:window-close'} color="secondary" variant="outlined" {...rest}>
    {children}
  </Button>
);

CancleButton.displayName = 'CancleButton';
CancleButton.defaultProps = {
  children: 'Cancel',
};

interface DiscardButtonI {
  onConfirm?: () => void;
  isDiscard?: boolean;
  actionState?: any;
}

export const DiscardButton: FC<ButtonI & DiscardButtonI> = ({
  isDiscard,
  actionState,
  onConfirm,
  onClick,
  children,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (actionState?.isSuccess) {
      setTimeout(() => {
        setOpen(false);
        actionState?.reset();
      }, 1500);
    }
  }, [actionState?.isSuccess]);

  return (
    <>
      <Button
        startIcon={'mdi:file-undo-outline'}
        color="secondary"
        variant="outlined"
        onClick={(e) => {
          if (isDiscard) {
            setOpen(true);
          } else if (onClick) {
            onClick(e);
          }
        }}
        {...rest}
      >
        {children}
      </Button>
      {isDiscard && (
        <DiscardConfirmModal
          actionState={actionState}
          open={open}
          handleClose={() => setOpen(false)}
          onClick={(e) => {
            setOpen(false);
            if (onClick) onClick(e);
          }}
        />
      )}
    </>
  );
};

DiscardButton.displayName = 'DiscardButton';
DiscardButton.defaultProps = {
  isDiscard: false,
  actionState: undefined,
  onConfirm: undefined,
  children: 'Close',
};

export const ClearButton: FC<ButtonI & DiscardButtonI> = ({
  isDiscard,
  actionState,
  onConfirm,
  onClick,
  children,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (actionState?.isSuccess) {
      setTimeout(() => {
        setOpen(false);
        actionState?.reset();
      }, 1500);
    }
  }, [actionState?.isSuccess]);

  return (
    <>
      <Button
        startIcon={'mdi:notification-clear-all'}
        color="secondary"
        variant="outlined"
        onClick={() => {
          if (isDiscard) {
            setOpen(true);
          }
        }}
        {...rest}
      >
        {children}
      </Button>
      {isDiscard && (
        <ClearConfirmModal
          actionState={actionState}
          open={open}
          handleClose={() => setOpen(false)}
          onClick={(e) => {
            setOpen(false);
            if (onClick) onClick(e);
          }}
        />
      )}
    </>
  );
};

ClearButton.displayName = 'ClearButton';
ClearButton.defaultProps = {
  isDiscard: false,
  actionState: undefined,
  onConfirm: undefined,
  children: 'Clear',
};

export const BackButton: FC<ButtonI & DiscardButtonI> = ({
  isDiscard,
  actionState,
  onConfirm,
  onClick,
  children,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (actionState?.isSuccess) {
      setTimeout(() => {
        setOpen(false);
        actionState?.reset();
      }, 1500);
    }
  }, [actionState?.isSuccess]);

  return (
    <>
      <Button
        startIcon={'mdi:keyboard-backspace'}
        color="secondary"
        variant="outlined"
        onClick={(e) => {
          if (isDiscard) {
            setOpen(true);
          } else if (onClick) {
            onClick(e);
          }
        }}
        {...rest}
      >
        {children}
      </Button>
      {isDiscard && (
        <DiscardConfirmModal
          actionState={actionState}
          open={open}
          handleClose={() => setOpen(false)}
          onClick={(e) => {
            setOpen(false);
            if (onClick) onClick(e);
          }}
        />
      )}
    </>
  );
};

BackButton.displayName = 'BackButton';
BackButton.defaultProps = {
  isDiscard: false,
  actionState: undefined,
  onConfirm: undefined,
  children: 'Back',
};

export const SubmitButton: FC<ButtonI & { actionState?: any }> = ({ children, actionState, ...rest }) => {
  useEffect(() => {
    if (actionState) {
      if (actionState?.isError) {
        alert(actionState?.error?.data?.error ?? 'Action faild');
      }
      if (actionState?.isSuccess) {
        setTimeout(() => {
          actionState?.reset();
        }, 1500);
      }

      () => {
        actionState?.reset();
      };
    }
  }, [actionState]);
  return (
    <Button
      type="submit"
      loading={actionState?.isLoading}
      success={actionState?.isSuccess}
      failed={actionState?.isError}
      startIcon={'mdi:content-save-all-outline'}
      {...rest}
    >
      {children}
    </Button>
  );
};

SubmitButton.displayName = 'SubmitButton';
SubmitButton.defaultProps = {
  children: 'Save',
};
