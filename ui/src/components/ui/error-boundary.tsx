import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorMessage } from './error-message';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { tokens } from '../../design-system/tokens';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{ padding: tokens.spacing[6] }}>
          <Card variant="outlined">
            <CardHeader>
              <CardTitle style={{ color: tokens.colors.error[600] }}>
                Что-то пошло не так
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ErrorMessage
                error={this.state.error?.message || 'Произошла непредвиденная ошибка'}
                variant="banner"
                onRetry={this.handleRetry}
              />
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details 
                  style={{ 
                    marginTop: tokens.spacing[4],
                    padding: tokens.spacing[3],
                    backgroundColor: tokens.colors.gray[50],
                    borderRadius: tokens.borderRadius.md,
                    border: `1px solid ${tokens.colors.gray[200]}`
                  }}
                >
                  <summary 
                    style={{ 
                      cursor: 'pointer',
                      fontWeight: tokens.typography.fontWeight.medium,
                      color: tokens.colors.gray[700]
                    }}
                  >
                    Детали ошибки (только в режиме разработки)
                  </summary>
                  <pre 
                    style={{ 
                      marginTop: tokens.spacing[2],
                      fontSize: tokens.typography.fontSize.xs,
                      color: tokens.colors.gray[600],
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}
                  >
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}