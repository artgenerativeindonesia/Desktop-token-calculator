import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { useProjectStore } from './store/projectStore';
import './styles/glassmorphism.css';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || String(error),
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080b14] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-2xl border border-rose-500/30 bg-[#111625] p-6 space-y-4 shadow-2xl">
            <div className="text-sm font-bold text-rose-400 uppercase tracking-wider">
              Pelindung Layar Aktif (Anti-Black-Screen)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Terjadi kendala teknis saat memuat bagian tampilan ini:{' '}
              <code className="text-rose-300 font-mono">
                {this.state.errorMessage}
              </code>
            </p>
            <button
              type="button"
              onClick={() => {
                useProjectStore.getState().setActiveTab('dashboard');
                this.setState({ hasError: false, errorMessage: '' });
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0099ff] hover:bg-[#007acc] text-white text-xs font-semibold transition"
            >
              Pulihkan & Kembali ke Beranda
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
);
