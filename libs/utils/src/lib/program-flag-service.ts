import { ConfirmedSignatureInfo, Connection, PublicKey } from '@solana/web3.js';

const isProgramBySignatures = (transactions: ConfirmedSignatureInfo[]) => {
  if (transactions.length < 20) {
    return false;
  }

  const slots: number[] = transactions.map((transaction) => transaction.slot);

  const totalSlotDiff = -slots.reduce(
    (sum: number, next, i) => (i === 0 ? sum : sum + (next - slots[i - 1])),
    0
  );
  const avgSlotDiff = totalSlotDiff / slots.length;

  // Roughly 10 minutes
  return avgSlotDiff < 1800;
};

const isProgram = async (connection: Connection, id: string) => {
  const signatures = await connection.getConfirmedSignaturesForAddress2(
    new PublicKey(id),
    {
      limit: 40,
    }
  );
  return isProgramBySignatures(signatures);
};

export const ProgramFlagService = {
  isProgram,
};
