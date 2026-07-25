/* ErrorBoundary.tsx — Accessible React Error Boundary Component */

import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ScriptIQ Uncaught Exception caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false });
    window.location.href = '/console';
  };

  private toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backgroundColor: 'var(--color-bg-app, #F8FAFC)',
            fontFamily: 'var(--font-sans, system-ui, sans-serif)',
          }}
        >
          <div
            style={{
              maxWidth: '560px',
              width: '100%',
              backgroundColor: 'var(--color-bg-surface, #FFFFFF)',
              borderRadius: '16px',
              border: '1px solid var(--color-border, #E2E8F0)',
              boxShadow: 'var(--shadow-lg, 0 12px 24px -4px rgba(15, 23, 42, 0.12))',
              padding: '32px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: 'var(--color-coral-light, #FDF2F2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
              }}
            >
              <AlertTriangle size={28} color="var(--color-coral, #E15554)" strokeWidth={2} />
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-heading, sans-serif)',
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--color-ink-900, #0F172A)',
                margin: '0 0 8px 0',
              }}
            >
              Something Went Wrong
            </h1>

            <p
              style={{
                fontSize: '14px',
                color: 'var(--color-ink-700, #334155)',
                lineHeight: 1.5,
                margin: '0 0 24px 0',
              }}
            >
              ScriptIQ encountered an unexpected application runtime error. Your patient session data remains safe in state.
            </p>

            {this.state.error && (
              <div style={{ marginBottom: '24px', textAlign: 'left' }}>
                <button
                  onClick={this.toggleDetails}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '12px',
                    color: 'var(--color-ink-500, #64748B)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {this.state.showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  <span>{this.state.showDetails ? 'Hide technical details' : 'Show technical details'}</span>
                </button>

                {this.state.showDetails && (
                  <pre
                    style={{
                      marginTop: '8px',
                      padding: '12px',
                      backgroundColor: 'var(--color-bg-subtle, #F1F5F9)',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border, #E2E8F0)',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '11px',
                      color: 'var(--color-coral, #E15554)',
                      overflowX: 'auto',
                      maxHeight: '160px',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {this.state.error.toString()}
                    {'\n'}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
              }}
            >
              <button
                onClick={this.handleReset}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-primary, #12897F)',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-heading, sans-serif)',
                  fontWeight: 600,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s ease',
                }}
              >
                <RefreshCw size={14} /> Reload Page
              </button>

              <button
                onClick={this.handleGoHome}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-bg-subtle, #F1F5F9)',
                  color: 'var(--color-ink-900, #0F172A)',
                  fontFamily: 'var(--font-heading, sans-serif)',
                  fontWeight: 600,
                  fontSize: '13px',
                  border: '1px solid var(--color-border, #E2E8F0)',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
              >
                <Home size={14} /> Doctor Console
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
