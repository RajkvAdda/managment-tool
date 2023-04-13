import { Component, ErrorInfo, ReactNode } from 'react';
import PageError from '../pages/error/PageError';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  static displayName: string;

  public static getDerivedStateFromError(): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render(): any {
    if (this.state.hasError) {
      return <PageError />;
    }
    return this.props.children;
  }
}

ErrorBoundary.displayName = 'ErrorBoundary';

export default ErrorBoundary;
