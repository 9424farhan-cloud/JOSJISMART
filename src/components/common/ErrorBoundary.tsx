import React from 'react';

interface State {
  error: Error | null;
}

/**
 * Prevents a blank screen when a render error occurs and offers a recovery action
 * that clears possibly-corrupted cached order data.
 */
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App crashed:', error, info);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('josji_orders_v3');
      localStorage.removeItem('josji_order_event_v2');
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#0b1528] text-slate-100 font-sans">
        <div className="max-w-md w-full text-center bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl">
          <div className="text-4xl mb-3">🌊</div>
          <h1 className="text-lg font-bold mb-2">Terjadi kesalahan saat memuat halaman</h1>
          <p className="text-xs text-slate-400 mb-5 break-words">{this.state.error.message}</p>
          <div className="flex gap-2 justify-center">
            <button
              id="error-reload-btn"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold"
            >
              Muat Ulang
            </button>
            <button
              id="error-reset-btn"
              onClick={this.handleReset}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold"
            >
              Reset Data Pesanan & Muat Ulang
            </button>
          </div>
        </div>
      </div>
    );
  }
}
