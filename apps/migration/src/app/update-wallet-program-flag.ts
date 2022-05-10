import { gql } from '@apollo/client';
import { hasuraClient, ProgramFlagService, throttle } from '@forbex-nxr/utils';
import { clusterApiUrl, Connection } from '@solana/web3.js';

const GetAllWalletsQuery = gql`
  query GetAllWallets {
    wallet(order_by: { worth: desc }) {
      id
    }
  }
`;

const UpdateWalletProgramFlagQuery = gql`
  mutation UpdateWalletProgramFlagById($id: String!, $program: Boolean!) {
    update_wallet_by_pk(pk_columns: { id: $id }, _set: { program: $program }) {
      id
    }
  }
`;

export const updateProgramWalletFlag = async () => {
  const {
    data: { wallet },
  } = await hasuraClient.query({ query: GetAllWalletsQuery });

  const tasks = wallet.map(({ id }) => async () => {
    const connection = new Connection(
      clusterApiUrl('mainnet-beta'),
      'confirmed'
    );

    console.log('Updating: start ', id);
    const program = await ProgramFlagService.isProgram(connection, id);

    await hasuraClient.mutate({
      mutation: UpdateWalletProgramFlagQuery,
      variables: { id, program },
    });

    console.log('Updating: done ', id);
  });

  console.log('Started');
  await throttle(tasks, 500, 1);
  console.log('Done');
};
