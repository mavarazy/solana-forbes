const asHuman = (amount: number): string => {
  if (amount > 1_000_000_000_000) {
    return `${(amount / 1_000_000_000_000).toLocaleString()} Trillions`;
  } else if (amount > 1_000_000_000) {
    return `${(amount / 1_000_000_000).toLocaleString()} Billions`;
  } else if (amount > 1_000_000) {
    return `${(amount / 1_000_000).toLocaleString()} Millions`;
  } else if (amount > 1_000) {
    return `${(amount / 1_000).toLocaleString()} Thousands`;
  }
  return `${amount}`;
};

export const NumberUtils = {
  asHuman,
};
