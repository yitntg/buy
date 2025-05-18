// 导入全局CSS
import '../src/shared/layouts/globals.css';
import RootLayout from '../src/shared/layouts/RootLayout';

export default function MyApp({ Component, pageProps }) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
} 