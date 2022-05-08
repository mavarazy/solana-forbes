const asHuman = (amount: number): string => {
  if (amount > 1_000_000_000_000) {
    return `${(amount / 1_000_000_000_000).toLocaleString()} Trillions`;
  } else if (amount > 1_000_000_000) {
    return `${(amount / 1_000_000_000).toLocaleString()} Billions`;
  } else if (amount > 1_000_000) {
    return `${(amount / 1_000_000).toLocaleString()} Millions`;
  }
  return `${amount.toLocaleString()}`;
};

export const NumberUtils = {
  asHuman,
};
