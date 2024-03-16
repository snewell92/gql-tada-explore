import { Client, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';

export const client = new Client({
  url: 'https://countries.trevorblades.com',
  exchanges: [cacheExchange({}), fetchExchange],
});
