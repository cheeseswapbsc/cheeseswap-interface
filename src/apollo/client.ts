import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client'

let transactionsClient: ApolloClient<NormalizedCacheObject> | null = null

const SUBGRAPH_URL = process.env.REACT_APP_TRANSACTIONS_SUBGRAPH_URL

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-and-network' as const,
    errorPolicy: 'ignore' as const
  },
  query: {
    fetchPolicy: 'network-only' as const,
    errorPolicy: 'all' as const
  }
}

export function getTransactionsClient(): ApolloClient<NormalizedCacheObject> | null {
  if (!SUBGRAPH_URL) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[apollo] Missing REACT_APP_TRANSACTIONS_SUBGRAPH_URL env variable')
    }
    return null
  }

  if (!transactionsClient) {
    transactionsClient = new ApolloClient({
      link: new HttpLink({ uri: SUBGRAPH_URL }),
      cache: new InMemoryCache(),
      defaultOptions
    })
  }

  return transactionsClient
}
