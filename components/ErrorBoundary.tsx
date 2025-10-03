import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export default class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service in production
    if (process.env.NODE_ENV === "production") {
      // Here you would typically send to error monitoring service
      // like Sentry, LogRocket, etc.
      console.error("Production error:", {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card">
                <div className="card-body text-center">
                  <h2 className="text-vim-error mb-4">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Oops! Something went wrong
                  </h2>

                  <p className="text-vim-fg mb-4">
                    We encountered an unexpected error. This has been logged and
                    we&apos;ll look into it.
                  </p>

                  {process.env.NODE_ENV === "development" &&
                    this.state.error && (
                      <details className="mb-4 text-left">
                        <summary className="text-vim-keyword cursor-pointer mb-2">
                          Error Details (Development Only)
                        </summary>
                        <div className="bg-vim-bg-alt p-3 rounded text-sm">
                          <pre className="text-vim-error whitespace-pre-wrap">
                            {this.state.error.toString()}
                          </pre>
                          {this.state.errorInfo && (
                            <pre className="text-vim-fg-dim mt-2 whitespace-pre-wrap">
                              {this.state.errorInfo.componentStack}
                            </pre>
                          )}
                        </div>
                      </details>
                    )}

                  <div className="d-flex gap-2 justify-content-center">
                    <button
                      className="btn btn-primary"
                      onClick={this.handleRetry}
                    >
                      <i className="fas fa-redo me-2"></i>
                      Try Again
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => window.location.reload()}
                    >
                      <i className="fas fa-refresh me-2"></i>
                      Reload Page
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
