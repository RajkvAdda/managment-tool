import { useEffect, useState } from 'react';
import { Link, Typography, Divider, Stack, Checkbox, FormControlLabel } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import Form from '../../components/Form';
import { EmailField, PasswordField } from '../../components/InputField';
import Button from '../../components/Buttons';
import Iconify from '../../components/iconify';
import { useAppDispatch } from '../../store/hooks';
import { useLoginMutation } from '../../store/auth/authApi';
import { setLoginData } from '../../store/auth/authSlice';
import { NavLink } from 'react-router-dom';

export default function Login() {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };
  const dispatch = useAppDispatch();
  const [login, loginState] = useLoginMutation();
  useEffect(() => {
    const { data, isSuccess } = loginState;
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
  }, [loginState]);
  return (
    <>
      <Helmet>
        <title> {`Login | Managment Tool`} </title>
      </Helmet>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Sign in to Managment Tool
      </Typography>

      <Stack direction="row" spacing={3}>
        <Button fullWidth size="large" color="inherit" variant="outlined">
          <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
        </Button>

        <Button fullWidth size="large" color="inherit" variant="outlined">
          <Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />
        </Button>

        <Button fullWidth size="large" color="inherit" variant="outlined">
          <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={22} height={22} />
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>
      <Form
        id="login-form"
        actionState={loginState}
        onFormSubmit={() => {
          login(formState);
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
            <PasswordField
              required
              label="Password"
              name="password"
              checkError={checkError}
              onChange={onChange}
              value={formState?.password}
            />
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
              <FormControlLabel control={<Checkbox name="remember" />} label="Remember Me" />
              <Link component={NavLink} to="/forgotpassword" variant="subtitle2" underline="hover">
                Forgot password?
              </Link>
            </Stack>

            <Button
              fullWidth
              type="submit"
              size="large"
              success={loginState?.isSuccess}
              failed={loginState?.isError}
              loading={loginState?.isLoading}
            >
              Login
            </Button>
          </>
        )}
      </Form>
    </>
  );
}
