const asHuman = (amount: number): string => {
  if (amount > 1_000_000_000_000) {
    return `${Math.round(
      amount / 1_000_000_000_000
    ).toLocaleString()} Trillions`;
  } else if (amount > 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(2)} Billions`;
  } else if (amount > 2_000_000) {
    return `${(amount / 1_000_000).toFixed(2)} Millions`;
  } else if (amount > 10_000) {
    return `${Math.round(amount).toLocaleString()}`;
  }
  return `${amount.toPrecision(4)}`;
};

export const NumberUtils = {
  asHuman,
};
