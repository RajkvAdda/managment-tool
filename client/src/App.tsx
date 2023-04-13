import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Alert, Snackbar } from '@mui/material';
import { useState } from 'react';
import { AlertType } from './utils/Enum';
import './app.css';
import Router from './routes';
import ThemeProvider from './theme';
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import { asyncErrorHandler, syncErrorHandler } from './utils/errorHandler';
import ErrorBoundary from './components/ErrorBoundary';
import { store, persistor } from './store';

// error handler events
window.onerror = () => {
  syncErrorHandler();
  return false;
};

window.onunhandledrejection = () => {
  asyncErrorHandler();
  return false;
};

// ----------------------------------------------------------------------

export default function App() {
  // default alert
  const [notification, setNotification] = useState({
    isOpen: false,
    msg: '',
    type: AlertType?.error,
  });

  const handleClose = () => {
    setNotification((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  window.alert = (msg, type = AlertType?.error) => {
    setNotification({
      isOpen: true,
      msg,
      type,
    });
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HelmetProvider>
          <BrowserRouter>
            <ThemeProvider>
              <ScrollToTop />
              <StyledChart />
              <ErrorBoundary>
                {/*  */}
                <Router />

                {/* alert notification */}
                <Snackbar
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                  open={notification?.isOpen}
                  // autoHideDuration={3000}
                  onClose={handleClose}
                  sx={{ zIndex: 100000 }}
                >
                  <Alert onClose={handleClose} severity={notification?.type} sx={{ width: '100%' }}>
                    {notification?.msg ?? 'error msg here'}
                  </Alert>
                </Snackbar>
              </ErrorBoundary>
            </ThemeProvider>
          </BrowserRouter>
        </HelmetProvider>
      </PersistGate>
    </Provider>
  );
}
