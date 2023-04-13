import { Typography, Divider, Collapse } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { NavLink } from 'react-router-dom';
import Button from '../../components/Buttons';
import Form from '../../components/Form';
import { BackIconButton } from '../../components/IconButtons';
import InputField, { EmailField, PasswordField } from '../../components/InputField';
import { useForgotPasswordMutation, useResetPasswordMutation } from '../../store/auth/authApi';
import { setLoginData } from '../../store/auth/authSlice';
import { useAppDispatch } from '../../store/hooks';
import { AlertType } from '../../utils/Enum';

export default function ForgotPassword() {
  const [isTokenSend, setIsTokenSend] = useState(false);
  // =============== FORM STATE ==================== //

  const [formState, setFormState] = useState({
    email: '',
    resetToken: '',
    password: '',
  });
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // =============== RESET PASSWORD ==================== //
  const [forgotPassword, forgotPasswordState] = useForgotPasswordMutation();
  useEffect(() => {
    const { isSuccess } = forgotPasswordState;
    if (isSuccess) {
      alert('Email Sent Successfully', AlertType.success);
      setIsTokenSend(() => true);
    }
  }, [forgotPasswordState?.data]);

  // =============== RESET PASSWORD ==================== //
  const dispatch = useAppDispatch();
  const [resetPassword, resetPasswordState] = useResetPasswordMutation();
  useEffect(() => {
    const { data, isSuccess } = resetPasswordState;
    if (isSuccess) {
      const time = new Date();
      const currentTime = time.getTime();
      setTimeout(() => {
        dispatch(
          setLoginData({
            token: data?.token,
            isLoggedIn: true,
            refreshTokenTime: currentTime,
          })
        );
      }, 1000);
     
    }
  }, [resetPasswordState]);

  // =============== Action State ==================== //
  const actionState = useMemo(() => {
    if (isTokenSend) {
      return resetPasswordState;
    } else {
      return forgotPasswordState;
    }
  }, [resetPasswordState, forgotPasswordState, isTokenSend]);

  return (
    <>
      <Helmet>
        <title> {`Forgot Password | Managment Tool`} </title>
      </Helmet>
      <Typography variant="h4" gutterBottom>
        <BackIconButton LinkComponent={NavLink} title="Go To Login" sx={{ mr: 2 }} to="/login" />
        Forgot Password
      </Typography>

      <Typography variant="body2">
        You will recive email for reset password token, Enter Token and new password to change new.
      </Typography>
      <Divider sx={{ my: 3 }}></Divider>
      <Form
        id="forgotpassword-form"
        actionState={actionState}
        onFormSubmit={() => {
          if (isTokenSend) {
            resetPassword({ resettoken: formState?.resetToken, body: { password: formState?.password } });
          } else {
            forgotPassword({ email: formState.email });
          }
        }}
      >
        {(checkError: boolean) => (
          <>
            <EmailField
              required
              label="Email"
              name="email"
              checkError={checkError}
              onChange={onChange}
              value={formState?.email}
            />
            <Collapse in={isTokenSend}>
              <>
                <InputField
                  required={isTokenSend}
                  label="Reset Token"
                  name="resetToken"
                  checkError={checkError}
                  onChange={onChange}
                  value={formState?.resetToken}
                />
                <PasswordField
                  required={isTokenSend}
                  label="Password"
                  name="password"
                  checkError={checkError}
                  onChange={onChange}
                  value={formState?.password}
                />
              </>
            </Collapse>
            <Button
              fullWidth
              type="submit"
              size="large"
              success={actionState?.isSuccess}
              failed={actionState?.isError}
              loading={actionState?.isLoading}
            >
              {isTokenSend ? 'Login' : 'Send Token'}
            </Button>
          </>
        )}
      </Form>
    </>
  );
}
