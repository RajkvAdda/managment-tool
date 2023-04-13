import React, { FC, useRef, useState, useEffect, ReactNode } from 'react';
import { CardActions, CardContent, Stack, CardContentProps } from '@mui/material';
import { SubmitButton, DiscardButton, BackButton, ClearButton } from './Buttons';
import TabAction from './TabAction';

export interface FormPropsI {
  onFormSubmit?: () => void;
  id?: string;
  isDiscard?: boolean;
  footerMargin?: string;
  children: any;
  actionState?: any;
  actions?: ReactNode;
  action?: ['submit' | 'clear' | 'close' | 'back' | undefined];
  onFormReset?: () => void;
  onFormClose?: () => void;
  cardContentProps?: CardContentProps;
  loading?: boolean;
  allowClose?: boolean;
  disabled?: boolean;
  disableMsg?: string;
  securityData?: {
    isNewEnabled?: boolean | undefined;
    isEditEnabled?: boolean | undefined;
    isDeleteEnabled?: boolean | undefined;
    isUploadorDownload?: boolean | undefined;
  };
}

const Form: FC<FormPropsI> = ({
  children,
  id,
  actionState,
  actions,
  action,
  cardContentProps,
  isDiscard,
  onFormReset,
  loading,
  footerMargin,
  onFormClose,
  allowClose,
  onFormSubmit,
  disabled,
  disableMsg,
  securityData: { isNewEnabled, isEditEnabled },
  ...rest
}) => {
  const [checkError, setCheckError] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  console.log('actionState', actionState);
  useEffect(() => {
    if (actionState?.isError) {
      alert(actionState?.error?.data?.error ?? 'Action faild');
    }
    if (actionState.isSuccess) {
      setTimeout(() => {
        actionState?.reset();
      }, 1500);
    }

    () => {
      actionState?.reset();
    };
  }, [actionState]);

  useEffect(() => {
    const filedLists = formRef.current?.querySelectorAll('.MuiTextField-root');
    const MuiFormControlLabel = formRef.current?.querySelectorAll('.MuiFormControlLabel-root');
    const MuiFormLabel = formRef.current?.querySelectorAll('.MuiFormLabel-root');
    const MuiInputLabel = formRef.current?.querySelectorAll('.MuiInputLabel-root');

    if (filedLists || MuiFormControlLabel || MuiInputLabel || MuiFormLabel) {
      let fieldArray = [
        ...(filedLists ?? []),
        ...(MuiFormControlLabel ?? []),
        ...(MuiFormLabel ?? []),
        ...(MuiInputLabel ?? []),
      ];
      if (loading) {
        fieldArray?.map((field) => field?.classList.add('skeleton'));
      } else {
        fieldArray?.map((field) => field?.classList.remove('skeleton'));
      }
    }
  }, [loading, formRef]);

  useEffect(() => {
    const filedLists = formRef.current?.querySelectorAll('input');
    const selectLists = formRef.current?.querySelectorAll('.MuiInputBase-input');

    let fieldArray = [...(filedLists ?? [])];
    let SelectArray = [...(selectLists ?? [])];

    if (disabled) {
      fieldArray?.map((field) => (field.disabled = true));
      SelectArray?.map((field) => (field.style.pointerEvents = 'none'));
    }
  }, [disabled]);

  const onSubmit = (e: any) => {
    if (!disabled) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      setCheckError(() => true);
      setTimeout(() => {
        if (formRef.current && onFormSubmit) {
          const erorrField = formRef.current?.querySelector('.Mui-error');
          if (!erorrField) {
            if (isDiscard == true || isDiscard == undefined) {
              onFormSubmit();
              setCheckError(() => false);
            } else if (isDiscard == false) {
              alert('Did not find any changes!');
            }
          }
        }
      }, 100);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {disabled && (
        <div
          style={{ zIndex: 9999, position: 'absolute', width: '100%', height: '100%' }}
          onClick={() => alert(disableMsg)}
        ></div>
      )}
      <form
        autoComplete="off"
        style={{ height: '100%' }}
        noValidate
        id={id}
        ref={formRef}
        onSubmit={onSubmit}
        {...rest}
      >
        <CardContent
          sx={{
            p: 0,
            pb: 1,
            height: action ? `calc(100% - ${footerMargin})` : '100%',
          }}
          {...cardContentProps}
        >
          {children(checkError, onSubmit)}
        </CardContent>

        {action && (
          <CardActions>
            <TabAction>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {action?.includes('close') && (
                  <DiscardButton
                    disabled={actionState?.isLoading}
                    isDiscard={isDiscard}
                    onClick={() => {
                      if (onFormClose) onFormClose();
                      actionState()?.reset();
                    }}
                  />
                )}
                {action?.includes('back') && (
                  <BackButton
                    disabled={actionState?.isLoading}
                    isDiscard={isDiscard}
                    onClick={() => {
                      if (onFormClose) onFormClose();
                      actionState()?.reset();
                    }}
                  />
                )}
                {actions}
                {action?.includes('clear') && (
                  <ClearButton
                    disabled={actionState?.isLoading}
                    isDiscard={isDiscard}
                    onClick={() => {
                      if (onFormReset) onFormReset();
                      actionState()?.reset();
                    }}
                  />
                )}
                {action?.includes('submit') && (
                  <SubmitButton
                    disabled={!isNewEnabled || !isEditEnabled || actionState?.isLoading}
                    data-automation={actionState?.isSuccess ? 'success' : ''}
                    id={`${id}-submit`}
                    onClick={onSubmit}
                    loading={actionState?.isLoading}
                    success={actionState?.isSuccess}
                    failed={actionState?.isError}
                  >
                    Save
                  </SubmitButton>
                )}
              </Stack>
            </TabAction>
          </CardActions>
        )}
      </form>
    </div>
  );
};

Form.defaultProps = {
  id: undefined,
  onFormSubmit: undefined,
  actionState: undefined,
  onFormClose: undefined,
  onFormReset: undefined,
  isDiscard: undefined,
  actions: undefined,
  action: undefined,
  disabled: undefined,
  disableMsg: 'Form is Disabled',
  cardContentProps: {},
  loading: false,
  footerMargin: '60px',
  allowClose: true,
  securityData: {
    isNewEnabled: true,
    isEditEnabled: true,
    isDeleteEnabled: true,
    isUploadorDownload: true,
  },
};
Form.displayName = 'Form';
export default Form;
