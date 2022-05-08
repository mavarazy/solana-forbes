import React, { ReactElement } from 'react';

export const Layout = ({
  children,
}: {
  children: JSX.Element;
}): ReactElement => (
  <div className="flex flex-col min-h-screen">{children}</div>
);
