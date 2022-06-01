const asHuman = (amount: number): string => {
  const absNum = Math.abs(amount);
  if (absNum > 1_000_000_000_000) {
    return `${Math.round(
      amount / 1_000_000_000_000
    ).toLocaleString()} Trillion`;
  } else if (absNum > 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(2)} Billion`;
  } else if (absNum > 2_000_000) {
    return `${(amount / 1_000_000).toFixed(2)} Millions`;
  } else if (absNum > 10_000) {
    return `${Math.round(amount).toLocaleString()}`;
  }
  if (Math.round(absNum) > 0) {
    return `${Math.round(amount).toLocaleString()}`;
  }
  return amount.toPrecision(4);
};

export const NumberUtils = {
  asHuman,
};
