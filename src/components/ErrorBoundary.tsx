import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message?: string;
}

/**
 * App-wide error boundary. When a render error escapes a route, we show a
 * graceful retry screen rather than a blank page. This protects against the
 * occasional CMS payload shape change or third-party widget failure breaking
 * the entire site for visitors.
 */
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary]", error, info?.componentStack);
  }

  private handleReload = () => {
    this.setState({ hasError: false, message: undefined });
    window.location.reload();
  };

  private handleHome = () => {
    this.setState({ hasError: false, message: undefined });
    window.location.href = "/";
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        role="alert"
        className="min-h-[60vh] flex items-center justify-center px-6 py-16 bg-[var(--bg)]"
      >
        <div className="max-w-md text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--teal)] mb-3">
            Something went wrong
          </p>
          <h1 className="text-[24px] font-bold text-[var(--dark)] mb-3">
            We hit an unexpected snag
          </h1>
          <p className="text-[14px] text-[var(--mid)] mb-6">
            Don&rsquo;t worry — your data is safe. Try reloading this page or head back home.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={this.handleReload}
              className="h-[44px] px-5 rounded-xl bg-[var(--teal)] text-white text-[13px] font-semibold hover:bg-[var(--teal-dark)] transition-colors"
            >
              Reload page
            </button>
            <button
              onClick={this.handleHome}
              className="h-[44px] px-5 rounded-xl border border-[var(--border-color)] text-[var(--dark)] text-[13px] font-semibold hover:bg-[var(--bg)] transition-colors"
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;