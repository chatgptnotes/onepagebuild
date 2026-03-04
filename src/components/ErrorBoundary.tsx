'use client';
import React from 'react';

interface Props { children: React.ReactNode; fallback?: React.ReactNode }
interface State { hasError: boolean; error?: Error }

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-500 mb-4">{this.state.error?.message}</p>
            <button onClick={() => { this.setState({ hasError: false }); window.location.href = '/sites'; }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Go to My Sites
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
