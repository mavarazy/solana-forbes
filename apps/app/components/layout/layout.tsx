import React, { ReactElement } from 'react';
import Footer from './footer';
import { Navigation } from './navigation';

export const Layout = ({
  children,
}: {
  children: JSX.Element;
}): ReactElement => (
  <>
    <Navigation />
    <div className="flex flex-col min-h-screen">{children}</div>
    <Footer />
  </>
);
