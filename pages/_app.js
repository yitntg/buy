import RootLayout from '../src/shared/layouts/RootLayout';

export default function MyApp({ Component, pageProps }) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
} 