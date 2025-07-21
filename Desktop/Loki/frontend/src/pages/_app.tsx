import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useAuthStore } from '../stores/authStore';
import '@picocss/pico/css/pico.min.css';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const loadUser = useAuthStore(state => state.loadUser);

  useEffect(() => {
    // Load user authentication state on app start
    loadUser();
  }, [loadUser]);

  return <Component {...pageProps} />;
}