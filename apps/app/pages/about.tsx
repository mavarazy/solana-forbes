import React from 'react';
import type { NextPage } from 'next';

const Code = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-gray-500 rounded-lg text-white mx-2 px-2 py-1">
    {children}
  </span>
);

const About: NextPage = () => (
  <main className="flex flex-1 flex-col">
    <div className="flex flex-1 m-2 sm:m-4 justify-center items-center">
      <div className="max-w-5xl flex flex-col flex-1 self-start">
        <h1 className="text-3xl mt-3 tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
          <span className="xl:inline">About</span>
        </h1>
        <h1 className="text-xl ml-3 sm:ml-5 mb-3 tracking-tight font-extrabold text-brand">
          Top wallets project on Solana
        </h1>
      </div>
    </div>
    <div className="relative px-4 mb-8 sm:px-6 lg:px-8">
      <div className="text-lg max-w-prose mx-auto">
        <p className="mt-8 text-xl text-gray-500 leading-8">
          This is a pet project of mine, exploring Solana Web3 libraries and
          related DeFi ecosystem. A crypto Forbes, with net worth and anonymity.
        </p>
      </div>
      <div className="mt-6 prose prose-indigo prose-lg text-gray-500 mx-auto">
        <h2>Wallet sources</h2>
        <p>
          To get a list of top accounts Solana native
          <Code>getTokenLargestAccounts</Code> was used for all tokens in
          official Solana
          <a href="https://github.com/solana-labs/token-list" className="mx-2">
            token list
          </a>
          . This is not ideal and most likely missed few accounts here and ther,
          but for MVP it was good enough.
        </p>
        <h2>Token price estimate</h2>
        <p>For token estimates 2 sources were used</p>
        <ul role="list">
          <li>
            <a href="https://coingecko.com/" target="_blank" rel="noreferrer">
              Coingecko
            </a>
          </li>
          <li>
            <a href="https://raydium.io/" target="_blank" rel="noreferrer">
              Raydium
            </a>
          </li>
        </ul>
        <p>
          Both would be only partially reliable, because again for both official
          Solana
          <a href="https://github.com/solana-labs/token-list" className="mx-2">
            token list
          </a>
          was used. Coin Gecko
          <Code>extensions.coingeckoId</Code>
          was used as a primary reference, and for Raydium
          <Code>symbol</Code> was used for pair matching.
        </p>
        <p>
          Token list is not verified, and does not guarantee uniqueness of data,
          so both symbol or coingeckoId can be repeated as many times as
          possible.Anyone can state any coingeckoId and create a token on
          mainnet-beta, without any verification.
        </p>
        <p>
          Some additional correction for token worth estimate was made, based on
          market capitalization of the token.
          <ul>
            <li>
              If market capitalization is 0, maximum estimate token worth is
              $100 000.
            </li>
            <li>
              If person holds significant percentage of specified Token, this
              percentage in capitalization is taken in account.
            </li>
          </ul>
          Without thouse corrections some accounts were counted to trillions of
          dollars.
        </p>
        <h2>NFT price estimates</h2>
        <p>
          There is no direct way to estimate NFT price on Solana, so to solve
          this few marketplaces were scrapped for collection floor prices, and
          best matched to the NFT. Matching mechanism is based on collection,
          family, name or symbol. List of scrapped NFT marketplaces follows.
        </p>
        <ul role="list">
          <li>
            <a href="https://www.fractal.is/" target="_blank" rel="noreferrer">
              Fractal
            </a>
          </li>
          <li>
            <a href="https://exchange.art/" target="_blank" rel="noreferrer">
              Exchange Art
            </a>
          </li>
          <li>
            <a href="https://solanart.io/" target="_blank" rel="noreferrer">
              Solana Art
            </a>
          </li>
          <li>
            <a
              href="https://digitaleyes.market/"
              target="_blank"
              rel="noreferrer"
            >
              Digital Eyes
            </a>
          </li>
        </ul>
        <h2>Machine vs People</h2>
        <p>
          To distinguish accounts of contracts from those of real people,
          average slot difference was used to calculate average transaction
          frequency, which is expected to be much higher for a machine.
        </p>
        <h2>Contact</h2>
        <ul role="list">
          <li>
            <a
              href="https://github.com/mavarazy"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href="https://github.com/mavarazy"
              target="_blank"
              rel="noreferrer"
            >
              Stack Overflow
            </a>
          </li>
          <li>
            <a
              href="mailto:mavarazy@gmail.com"
              target="_blank"
              rel="noreferrer"
            >
              Email
            </a>
          </li>
        </ul>
      </div>
    </div>
  </main>
);

export default About;
