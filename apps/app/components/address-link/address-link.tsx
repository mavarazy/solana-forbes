import React from 'react';

export const AddressLink = ({
  address,
  children,
}: {
  address: string;
  children?: React.ReactNode;
}) => (
  <a
    href={`https://explorer.solana.com/address/${address}`}
    target="_blank"
    rel="noreferrer"
  >
    {children || address}
  </a>
);
