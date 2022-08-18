# About

  This is a pet project of mine, exploring Solana Web3 libraries and related DeFi ecosystem. A crypto Forbes, with net worth and anonymity.

## Wallet sources

  To get a list of top accounts Solana native ```getTokenLargestAccounts``` was used for all tokens in official Solana [token list](https://github.com/solana-labs/token-list). This is not ideal and most likely missed few accounts here and ther, but for MVP it was good enough.

## Token price estimate

  For token estimates 2 sources were used

    - [Coingecko](https://coingecko.com/)
    - [Raydium](https://raydium.io/)

Both would be only partially reliable, because again for both official Solana token list was used. Coin Gecko ```extensions.coingeckoId``` was used as a primary reference, and for Raydium ````symbol``` was used for pair matching.

Token list is not verified, and does not guarantee uniqueness of
data, so both symbol or coingeckoId can be repeated as many times as
possible.Anyone can state any coingeckoId and create a token on
mainnet-beta, without any verification.

Some additional correction for token worth estimate was made, based
on market capitalization of the token.

- If market capitalization is 0, maximum estimate token worth is $100 000.
- If person holds significant percentage of specified Token, this percentage in capitalization is taken in account.

Without thouse corrections some accounts were counted to trillions of dollars.

## NFT price estimates

There is no direct way to estimate NFT price on Solana, so to solve this few marketplaces were scrapped for collection floor prices, and best matched to the NFT. Matching mechanism is based on collection, family, name or symbol. List of scrapped NFT marketplaces follows.

- [Magic Eden](https://magiceden.io/)
- [Solana Art](https://solanart.io/)
- [Solsea](https://solsea.io/)
- [Digital Eyes](https://digitaleyes.market/)
- [Exchange Art](https://exchange.art/)
- [Alpha Art](https://alpha.art/)
- [Fractal](https://www.fractal.is/)

## Machine vs People

  To distinguish accounts of contracts from those of real people, average slot difference was used to calculate average transaction frequency, which is expected to be much higher for a machine.

# Tech

The project is written in:
- [NX.dev](https://nx.dev/) for monorepo
- Hasura as a data layer (hasura folder)
- React with next.js
- Node for updating NFT collection prices, wallet evaluation

Deployment
- [Vercel](https://vercel.app/) for hosting next.js
- [Render](https://render.com/) for hasura and update tasks
