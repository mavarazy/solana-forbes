import React, { useRef } from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Layout } from '../components/layout';
import { Notification, NotificationProps } from '../components/notification';
import { GlobalContext } from '../context';

function MyApp({ Component, pageProps }: AppProps) {
  const notificationRef = useRef<NotificationProps>(null);

  const handleError = (error: string) => {
    console.log('Error ', error);
    notificationRef.current?.error(error);
  };

  return (
    <GlobalContext.Provider value={{ onError: handleError }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Notification ref={notificationRef} />
    </GlobalContext.Provider>
  );
}
export default MyApp;
