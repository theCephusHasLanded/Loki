import type { AppProps } from 'next/app';
import { Inter, JetBrains_Mono } from 'next/font/google';
import FeedbackModal from '../components/modals/FeedbackModal';
import '../styles/globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-primary'
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono'
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <Component {...pageProps} />
      <FeedbackModal />
    </div>
  );
}
