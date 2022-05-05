import React, { useRef } from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Layout } from '../components/layout';
import { Notification, NotificationProps } from '../components/notification';

function MyApp({ Component, pageProps }: AppProps) {
  const notificationRef = useRef<NotificationProps>(null);

  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Notification ref={notificationRef} />
    </>
  );
}
export default MyApp;
