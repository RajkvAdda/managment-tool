import { Box, Divider, Drawer, Stack, Typography } from '@mui/material';
import { SubmitButton } from './Buttons';
import Form from './Form';
import { CloseIconButton } from './IconButtons';
import { FC } from 'react';

const SideForm: FC<{
  open: boolean;
  PaperProps?: any;
  title: string;
  onClose: any;
  children?: any;
  id: string;
  onFormSubmit: any;
  isDiscard: boolean;
  actionState: any;
}> = ({ open, PaperProps, title = 'Add Form', onClose, children, id, onFormSubmit, isDiscard, actionState }) => {
  return (
    <Drawer
      anchor="right"
      open={Boolean(open)}
      PaperProps={{
        sx: { minWidth: 320, borderRadius: '10px 0 0 10px' },
        ...PaperProps,
      }}
    >
      <Stack
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 1, py: 2, position: 'sticky', top: 0, zIndex: 3, bgcolor: 'background.paper' }}
      >
        <Typography variant="subtitle1" sx={{ ml: 1 }}>
          {title}
        </Typography>
        <CloseIconButton
          onClick={() => {
            if (onClose) onClose();
          }}
        />
      </Stack>

      <Divider />
      <Box sx={{ p: 2 }}>
        <Form
          id={id ?? 'form'}
          isDiscard={Boolean(isDiscard)}
          onFormSubmit={() => {
            if (onFormSubmit) onFormSubmit();
          }}
          actionState={actionState}
        >
          {(checkError: boolean) => (
            <Stack direction="column" sx={{ minHeight: '80vh', justifyContent: 'space-between' }}>
              <div>{children(checkError)}</div>
              <Box
                sx={{
                  position: 'sticky',
                  bottom: 10,
                  pt: 1,
                  zIndex: 3,
                  bgcolor: 'background.paper',
                  width: '100%',
                }}
              >
                <SubmitButton
                  fullWidth
                  loading={actionState?.isLoading}
                  success={actionState?.isSuccess}
                  failed={actionState?.isError}
                >
                  Save
                </SubmitButton>
              </Box>
            </Stack>
          )}
        </Form>
      </Box>
    </Drawer>
  );
};
export default SideForm;
