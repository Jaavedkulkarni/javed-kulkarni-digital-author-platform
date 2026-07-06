import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ReaderErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ReaderErrorBoundaryState {
  hasError: boolean;
}

export class ReaderErrorBoundary extends Component<ReaderErrorBoundaryProps, ReaderErrorBoundaryState> {
  state: ReaderErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ReaderErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[AuthorOS:reader] boundary caught error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
            Something went wrong loading your reader data. Please refresh and try again.
          </div>
        )
      );
    }

    return this.props.children;
  }
}
