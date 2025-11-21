import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full p-8 bg-red-50">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-red-900 mb-4">ParticipantDashboard Error</h2>
            <p className="text-red-700 mb-4">
              An error occurred while rendering the ParticipantDashboard component.
            </p>
            <div className="bg-red-100 border border-red-300 rounded p-4 mb-4">
              <p className="text-red-800 font-mono text-sm break-words">
                {this.state.error?.toString()}
              </p>
            </div>
            <p className="text-red-600 text-sm">
              Check the browser console (F12) for more details.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
