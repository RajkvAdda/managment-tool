/* eslint-disable react/require-default-props */
import {
  Dialog,
  DialogProps,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentProps,
  Stack,
  styled,
  alpha,
  Alert,
  Box,
  Typography,
} from '@mui/material';
import { FC, ReactNode, useEffect, useState } from 'react';
import Button, { DeleteButton, CancleButton } from './Buttons';
import useAudio, { soundLists } from '../utils/useAudio';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Iconify from './iconify';

const handleBackDropClick = (e: any) => {
  let { target } = e;
  target.classList.add('modal-shink');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useAudio(soundLists?.error);
  setTimeout(() => {
    target.classList.remove('modal-shink');
  }, 400);
};
interface DialogPropsI extends DialogProps {
  color?: 'primary' | 'secondary' | 'error' | 'warning' | undefined;
}
interface PropsI {
  open: boolean;
  handleClose?: () => void;
  title?: any;
  action?: ReactNode;
  dialogContentProps?: DialogContentProps;
  children?: any;
  dialogActions?: any;
  tableModal?: boolean;
}

const DialogStyled = styled(Dialog)<DialogPropsI & PropsI>(({ color, theme, tableModal }) => ({
  // '& .MuiBackdrop-root': {
  //     bottom: '35px'
  // },
  '& .MuiDialog-paper': {
    maxWidth: tableModal ? 'max-content' : '',
    minWidth: '350px',
    [theme.breakpoints.down(600)]: { maxWidth: '80%' },
  },
  ...(color == 'error' && {
    '& .MuiDialog-paper': {
      color: theme.palette.error.main,
    },
    '& .MuiDialogContent-root': {
      backgroundColor: alpha(theme.palette.error.light, 0.15),
    },
  }),
  ...(color == 'warning' && {
    '& .MuiDialog-paper': {
      color: theme.palette.warning.main,
    },
    '& .MuiDialogContent-root': {
      backgroundColor: alpha(theme.palette.warning.light, 0.15),
    },
  }),
}));

const Modal: FC<PropsI & DialogPropsI> = ({
  open,
  handleClose,
  title,
  action,
  dialogContentProps,
  children,
  tableModal,
  dialogActions,
  ...rest
}) => {
  return (
    <DialogStyled open={open} onClose={handleBackDropClick} tableModal={tableModal} {...rest}>
      {title && (
        <DialogTitle
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            padding: '0.7rem 1rem',
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{title}</span>
          <div>
            <span id="modal-action"></span>
            <span id="master-filter-in-modal"></span>
          </div>
        </DialogTitle>
      )}

      <DialogContent
        sx={{
          padding: tableModal ? '0rem !important' : '0.7rem 1rem !important',
        }}
        {...dialogContentProps}
      >
        {children}
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          padding: '0.7rem 1rem',
        }}
      >
        <Stack direction="row" spacing={1}>
          {handleClose && (
            <CancleButton size="small" onClick={handleClose}>
              Cancel
            </CancleButton>
          )}
          {action}
        </Stack>
      </DialogActions>
      <div>{dialogActions}</div>
    </DialogStyled>
  );
};

Modal.displayName = 'Modal';
Modal.defaultProps = {
  title: undefined,
  action: undefined,
  dialogContentProps: {},
  color: undefined,
  dialogActions: undefined,
  handleClose: undefined,
  tableModal: undefined,
};

export default Modal;

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500,
  },
});

export const FormModal: FC<PropsI & DialogPropsI & { info?: Array<any> }> = ({
  open,
  title,
  children,
  info,

  ...rest
}) => {
  const [openToolTip, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };
  return (
    <DialogStyled open={open} onClose={handleBackDropClick} {...rest}>
      {title && (
        <DialogTitle
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            padding: '0.7rem 1rem',
          }}
        >
          <Stack justifyContent={`space-between`} alignItems="center">
            <Typography variant="h5">{title}</Typography>
            {info && (
              <ClickAwayListener onClickAway={handleTooltipClose}>
                <div>
                  <CustomWidthTooltip
                    sx={{ zIndex: 1000000 }}
                    PopperProps={{
                      disablePortal: true,
                    }}
                    onClose={handleTooltipClose}
                    open={openToolTip}
                    arrow
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    title={
                      <Box onClick={handleTooltipClose}>
                        {info?.map((item, index) => (
                          <div key={index}>
                            <Typography variant="h5">{item?.title}</Typography>
                            {item?.desc?.map((d, i) => (
                              <Typography variant="caption" sx={{ display: 'block', p: 1 }} key={i}>
                                {d}
                              </Typography>
                            ))}
                          </div>
                        ))}
                      </Box>
                    }
                  >
                    <Iconify icon="mdi:information-slab-box-outline" />
                  </CustomWidthTooltip>
                </div>
              </ClickAwayListener>
            )}
          </Stack>
        </DialogTitle>
      )}

      {children}
    </DialogStyled>
  );
};

FormModal.displayName = 'FormModal';
FormModal.defaultProps = {
  title: undefined,
  action: undefined,
  dialogContentProps: {},
  color: undefined,
  dialogActions: undefined,
  info: undefined,
};

interface ModalProps extends PropsI {
  onClick?: () => void | undefined;
  actionState?: any;
}
export const DeleteConfirmModal: FC<ModalProps & DialogPropsI> = ({
  onClick,
  children,
  actionState,
  handleClose,
  ...rest
}) => {
  useEffect(() => {
    if (actionState?.isSuccess && handleClose) {
      setTimeout(() => {
        handleClose();
        actionState?.reset();
      }, 1500);
    }
  }, [actionState?.isSuccess]);
  return (
    <Modal
      color="error"
      title={
        <Stack direction={'row'} spacing={1} alignItems="center">
          <Iconify icon="mdi:delete-outline" />
          <span>Delete Confirm</span>
        </Stack>
      }
      action={
        <DeleteButton
          size="small"
          color="error"
          loading={actionState?.isLoading}
          success={actionState?.isSuccess}
          failed={actionState?.isError}
          onClick={onClick}
        />
      }
      dialogActions={
        actionState?.error ? (
          <Alert severity="error">{`${actionState?.error?.data?.error ?? 'Action Failed'}`}</Alert>
        ) : undefined
      }
      handleClose={handleClose}
      {...rest}
    >
      {children ?? (
        <div style={{ textAlign: 'center', width: '350px' }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Are you sure
          </Typography>
          <Typography variant="h6">You want to Delete!</Typography>
        </div>
      )}
    </Modal>
  );
};

DeleteConfirmModal.displayName = 'DeleteConfirmModal';
DeleteConfirmModal.defaultProps = {
  onClick: undefined,
  children: undefined,
};

export const DiscardConfirmModal: FC<ModalProps & DialogPropsI> = ({ onClick, children, actionState, ...rest }) => {
  return (
    <Modal
      color="warning"
      title={
        <Stack direction={'row'} spacing={1} alignItems="center">
          <Iconify icon="mdi:window-close" />

          <span>Form Confirm</span>
        </Stack>
      }
      action={
        <Button
          size="small"
          startIcon={<Iconify icon="mdi:window-close" />}
          color="warning"
          loading={actionState?.isLoading}
          success={actionState?.isSuccess}
          failed={actionState?.isError}
          onClick={onClick}
        >
          Discard
        </Button>
      }
      {...rest}
    >
      {children ?? (
        <div style={{ textAlign: 'center', width: '350px' }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Are you sure
          </Typography>
          <Typography variant="h4">You want to Discard your Changes!</Typography>
        </div>
      )}
    </Modal>
  );
};

DiscardConfirmModal.displayName = 'DiscardConfirmModal';
DiscardConfirmModal.defaultProps = {
  onClick: undefined,
  children: undefined,
};

export const ClearConfirmModal: FC<ModalProps & DialogPropsI> = ({ onClick, children, actionState, ...rest }) => {
  return (
    <Modal
      color="warning"
      title={
        <Stack direction={'row'} spacing={1} alignItems="center">
          <Iconify icon="mdi:window-close" />

          <span>Clear Confirm</span>
        </Stack>
      }
      action={
        <Button
          size="small"
          startIcon={<Iconify icon="mdi:window-close" />}
          color="warning"
          loading={actionState?.isLoading}
          success={actionState?.isSuccess}
          failed={actionState?.isError}
          onClick={onClick}
        >
          Clear
        </Button>
      }
      {...rest}
    >
      {children ?? (
        <div style={{ textAlign: 'center', width: '350px' }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Are you sure
          </Typography>
          <Typography variant="h4">You want to Clear your Changes!</Typography>
        </div>
      )}
    </Modal>
  );
};

ClearConfirmModal.displayName = 'ClearConfirmModal';
ClearConfirmModal.defaultProps = {
  onClick: undefined,
  children: undefined,
};
